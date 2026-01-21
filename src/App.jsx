import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import { AddTask } from "./Add";
import { TaskManager, useTasksTags } from "./TaskManager";
import { YMDToDate } from "./convertDate";

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

    if (id == undefined) {
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
        <SearchDropdown inputName={"tag"} defVal={tag.id} items={tags} />
        {/* <label>Цель</label>
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
        </select> */}
        <button>добавить задачу</button>
      </form>
    </div>
  );
}

function SearchDropdown({ inputName, defVal, items }) {
  const [searchInput, setSearchInput] = useState(null);
  console.log(inputName);
  console.log(defVal);
  console.log(items);

  if ("name" in items[0] && searchInput) {
    items = items.filter((item) => item.name.includes(searchInput));
  } else if ("title" in items[0] && searchInput) {
    items = items.filter((item) => item.title.includes(searchInput));
  }

  return (
    <>
      <input onChange={(e) => setSearchInput(e.target.value)}></input>
      <select name={inputName} required value={defVal}>
        {items.map((item) => {
          return <option value={item.id}>{item.name}</option>;
        })}
      </select>
      ;
    </>
  );
}

function ProgressBar() {}

function Dashboard() {
  const context = useTasksTags();

  let [localTasks, setLocalTasks] = useState(
    sortTasks(context.tasksTags.tasks)
  );

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let newLocalTasks = sortTasks(context.tasksTags.tasks);
    setLocalTasks(sortTasks(newLocalTasks));
  }, [context]);

  const [selectedTag, setSelectedTag] = useState(null);

  function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
      if (YMDToDate(a.date) > YMDToDate(b.date)) {
        return 1;
      }
      if (YMDToDate(a.date) < YMDToDate(b.date)) {
        return -1;
      }
      return 0;
    });
  }

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

  function onTrackClick(tagId) {
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
    setIsClicked(!isClicked);
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
        <Gantt onTrackClick={onTrackClick} selectedTag={selectedTag} />
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
