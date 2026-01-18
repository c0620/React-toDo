import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import { AddTask } from "./Add";
import { TaskManager, useTasksTags } from "./TaskManager";

function Card({ task, handleClickDone, handleDeleteCard }) {
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
        <button>edit</button>
        <button onClick={() => handleDeleteCard(task)}>Удалить</button>
      </div>
    </div>
  );
}

function Button() {}

function ProgressBar() {}

function Dashboard() {
  const context = useTasksTags();

  let [localTasks, setLocalTasks] = useState(context.tasksTags.tasks);
  let [selectedTag, setSelectedTag] = useState(null);

  function handleClickDone(task) {
    context.dispatch({ type: "taskToggleDone", task: task });
  }

  function handleDeleteCard(task) {
    console.log(task);
    if (task.tag.tasks == 1) {
      context.dispatch({ tag: tasksTags.tag, type: "tagDelete" });
    } else {
      context.dispatch({ type: "tagEdit", count: -1, tag: tasksTags.tag });
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
            />
          ))}
        </div>
      </div>
      <AddTask />
    </>
  );
}

export default Dashboard;
