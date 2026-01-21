import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import { AddTask } from "./Add";
import { TaskManager, useTasksTags } from "./TaskManager";

function Card({ task, handleClickDone, handleDeleteCard, handleEditCard }) {
  return (
    <div className="card">
      <div>
        <div>
          {task.date.toLocaleString("default", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <div style={{ color: task.tag.color.main }}>{task.tag.name}</div>
      </div>
      <h3>{task.title}</h3>
      <div>
        <button onClick={() => handleClickDone(task)}>
          {task.done ? "Отменить" : "Выполнить"}
        </button>
        <button onClick={() => handleEditCard("editTask", task)}>edit</button>
        <button onClick={() => handleDeleteCard(task)}>Удалить</button>
      </div>
    </div>
  );
}

function AddEditTag({
  tagId = null,
  color = null,
  name = null,
  date = new Date(),
  tag = null,
  title = null,
  done = false,
}) {
  const context = useTasksTags();
}

function AddEditTask({
  id = undefined,
  date = null,
  tag = { id: 1 },
  title = undefined,
  done = false,
}) {
  const context = useTasksTags();

  let tags = context.tasksTags.tags;

  const [sDate, setSDate] = useState("");

  useEffect(() => {
    const d = date ? new Date(date) : new Date();
    setSDate(formatDateForInput(d));
  }, [date]);

  console.log(date);
  console.log(sDate);
  const [tagList, selectTagList] = useState(tags);

  const formInput = useRef();

  function formatDateForInput(date) {
    return date.toISOString().slice(0, 10);
  }

  function onTaskSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());
    console.log(formObject);
    let currentTag = tags.filter((tag) => +formObject.tag == tag.id)[0];
    let taskDate = formObject.date;

    if (!id) {
      context.dispatch({
        type: "taskAdd",
        task: {
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done,
        },
      });

      context.dispatch({
        type: "tagEdit",
        tag: {
          id: tag.id,
        },
        count: 1,
      });
    } else {
      context.dispatch({
        type: "taskEdit",
        task: {
          id,
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done,
        },
      });
    }
  }

  function onTagInput(input) {}

  return (
    <div>
      <form onSubmit={onTaskSubmit} ref={formInput}>
        <label>Название задачи</label>
        <input type="text" name="title" required defaultValue={title} />
        <label>День выполнения задачи</label>
        <input
          type="date"
          name="date"
          value={sDate}
          onChange={(e) => setSDate(e.target.value)}
        />
        <label>Цель</label>
        <input></input>
        <select name="tag" required defaultValue={tag.id}>
          {tagList.map((currentTag) => {
            if (currentTag.id == tag.id) {
              return (
                <option value={currentTag.id} selected>
                  {currentTag.name}
                </option>
              );
            }
            return <option value={currentTag.id}>{currentTag.name}</option>;
          })}
        </select>
        <button>добавить задачу</button>
      </form>
    </div>
  );
}

function Button() {}

function ProgressBar() {}

function Dashboard() {
  const context = useTasksTags();

  let [localTasks, setLocalTasks] = useState(context.tasksTags.tasks);

  useEffect(() => {
    let newLocalTasks = context.tasksTags.tasks;
    setLocalTasks(newLocalTasks);
  }, [context]);

  let [selectedTag, setSelectedTag] = useState(null);
  console.log(localTasks);

  function handleClickDone(task) {
    context.dispatch({ type: "taskToggleDone", task: task });
  }

  function handleDeleteCard(task) {
    console.log(task);
    if (task.tag.tasks == 1) {
      context.dispatch({ tag: task.tag, type: "tagDelete" });
    } else {
      context.dispatch({ type: "tagEdit", count: -1, tag: task.tag });
    }
    context.dispatch({ type: "taskDelete", task: task });
  }

  function onTrackHover(tagId, isClicked) {
    let newLocalTasks;
    if (isClicked) {
      setSelectedTag(null);
      newLocalTasks = context.tasksTags.tasks;
    } else {
      setSelectedTag(tagId);
      console.log(selectedTag);
      newLocalTasks = localTasks.slice();
      newLocalTasks.sort((a, b) => {
        if (a.tag.id == tagId && b.tag.id == tagId) {
          return 0;
        }
        if (a.tag.id != tagId && b.tag.id == tagId) {
          return 1;
        }
        if (a.tag.id == tagId && b.tag.id != tagId) {
          return -1;
        }
      });
    }

    setLocalTasks(newLocalTasks);
  }

  let [addProps, setAddProps] = useState({});

  function prepFields(type, data) {
    if (type == "editTask") {
      setAddProps({ ...data });
    }
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <Gantt onTrackHover={onTrackHover} selectedTag={selectedTag} />
        <div style={{ flexDirection: "column" }}>
          {localTasks.map((task) => (
            <Card
              task={task}
              handleClickDone={handleClickDone}
              handleDeleteCard={handleDeleteCard}
              handleEditCard={prepFields}
            />
          ))}
        </div>
      </div>
      <AddEditTask {...addProps} />
    </>
  );
}

export default Dashboard;
