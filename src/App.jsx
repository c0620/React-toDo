import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Gantt from "./Gantt";
import * as mock from "./data";

const test_card = {
  data: "8 декабря 2026",
  target: "тестовая цель",
  title: "Очень динное очень важное название",
};

function Card({ task, handleClickDone }) {
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
          {task.done ? "Выполнить" : "Отменить"}
        </button>
        <button>edit</button>
        <button>delete</button>
      </div>
    </div>
  );
}

function Button() {}

function ProgressBar() {}

function DashBoard() {
  const [tasks, setTasks] = useState(mock.user_tasks);

  function handleClickDone(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id == task.id) {
          t.done = !t.done;
        }
        return t;
      })
    );
  }

  return (
    <>
      <Card task={tasks[0]} handleClickDone={handleClickDone} />
      <Gantt />
    </>
  );
}

export default DashBoard;
