import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import { AddTask } from "./Add";
import { TaskManager, useTasksTags } from "./TaskManager";

const test_card = {
  data: "8 декабря 2026",
  target: "тестовая цель",
  title: "Очень динное очень важное название",
};

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
        <div>{task.tag.name}</div>
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

  const tasks = context.tasksTags.tasks;
  console.log(tasks);

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

  return (
    <>
      <div style={{ display: "flex" }}>
        <Gantt />
        <div style={{ flexDirection: "column" }}>
          {tasks.map((task) => (
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
