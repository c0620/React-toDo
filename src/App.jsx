import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import { AddTask } from "./Add";
import { TaskManager, useTasksTags } from "./TaskManager";
import { dateToYMD, YMDToDate } from "./convertDate";

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
        <button onClick={() => handleEditCard(task)}>edit</button>
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

function AddEditTask({ task, handleEditField }) {
  const context = useTasksTags();

  let tags = context.tasksTags.tags;

  const d = task ? dateToYMD(new Date(task.date)) : dateToYMD(new Date());

  const formInput = useRef();

  function onTaskSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());
    console.log(formObject);
    let currentTag = tags.filter((tag) => +formObject.tag == tag.id)[0];
    let taskDate = formObject.date;

    if (!task) {
      context.dispatch({
        type: "taskAdd",
        task: {
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done: false,
        },
      });

      context.dispatch({
        type: "tagEdit",
        tag: {
          id: currentTag.id,
        },
        count: 1,
      });
    } else {
      context.dispatch({
        type: "taskEdit",
        task: {
          id: task.id,
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done: task.done,
        },
      });
    }
  }

  return (
    <div>
      <form onSubmit={onTaskSubmit} ref={formInput}>
        <label>Название задачи</label>
        <input
          type="text"
          name="title"
          required
          value={task ? task.title : ""}
          onChange={(e) => handleEditField("title", e.target.value)}
        />
        <label>День выполнения задачи</label>
        <input
          type="date"
          name="date"
          value={d}
          onChange={(e) => handleEditField("date", e.target.value)}
        />
        <SearchDropdown
          inputName={"tag"}
          value={task ? task.tag.id : ""}
          onChange={handleEditField}
          items={tags}
        />
        <button type="submit">добавить задачу</button>
      </form>
    </div>
  );
}

function SearchDropdown({ inputName, value, onChange, items }) {
  const [searchInput, setSearchInput] = useState(null);
  let filteredItems = items;
  if ("name" in items[0] && searchInput) {
    filteredItems = items.filter((item) => item.name.includes(searchInput));
  } else if ("title" in items[0] && searchInput) {
    filteredItems = items.filter((item) => item.title.includes(searchInput));
  }

  return (
    <>
      <input onChange={(e) => setSearchInput(e.target.value)}></input>
      <select
        name={inputName}
        required
        value={value}
        onChange={(e) => onChange("tag", { id: Number(e.target.value) })}
      >
        {filteredItems.map((item) => {
          return (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          );
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

  const [fields, setFields] = useState(null);

  function handleEditCard(task) {
    setFields({ ...task });
  }

  function handleEditField(field, value) {
    setFields({ ...fields, [field]: value });
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
              handleEditCard={handleEditCard}
            />
          ))}
        </div>
      </div>
      <AddEditTask task={fields} handleEditField={handleEditField} />
    </>
  );
}

export default Dashboard;
