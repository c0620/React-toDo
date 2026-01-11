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

function DashBoard() {
  const [taggedTasks, setTaggedTasks] = useState(mock.tagged_tasks);

  function handleClickDone(task) {
    console.log(task);
    console.log(taggedTasks);

    let currentTagId = task.tag.id;
    let currentTag = taggedTasks[currentTagId];
    let currentTagTasks = currentTag.tasks;

    console.log(currentTagTasks);
    currentTagTasks = currentTagTasks.map((t) => {
      if (t.id != task.id) {
        return t;
      } else {
        return { ...t, done: !t.done };
      }
    });
    console.log(currentTagTasks);

    let newTagged = { ...currentTag, tasks: currentTagTasks };
    let newTasks = { ...taggedTasks, [currentTagId]: newTagged };
    setTaggedTasks(newTasks);
  }

  function handleDeleteCard(task) {
    let currentTagId = task.tag.id;
    let currentTag = taggedTasks[currentTagId];
    let currentTagTasks = currentTag.tasks.filter((t) => t.id != task.id);
    console.log(currentTagTasks);
    let newTasks;
    if (currentTagTasks.length != 0) {
      let first = currentTagTasks[0].date;
      let last = currentTagTasks[0].date;
      for (let i = 0; i < currentTagTasks.length; i++) {
        if (+first > +currentTagTasks[i].date) {
          first = currentTagTasks[i].date;
        }
        if (+last < +currentTagTasks[i].date) {
          last = currentTagTasks[i].date;
        }
      }
      let newTagged = {
        ...currentTag,
        tasks: currentTagTasks,
        first,
        last,
      };
      newTasks = { ...taggedTasks, [currentTagId]: newTagged };
    } else {
      newTasks = { ...taggedTasks };
      delete newTasks[currentTagId];
    }

    setTaggedTasks(newTasks);
    console.log(newTasks);
  }

  let tasks = [];

  console.log(taggedTasks);

  for (let tagId in taggedTasks) {
    tasks.push(...taggedTasks[tagId].tasks);
  }
  console.log(tasks);

  return (
    <>
      {tasks.map((task) => (
        <Card
          task={task}
          handleClickDone={handleClickDone}
          handleDeleteCard={handleDeleteCard}
        />
      ))}

      <Gantt tasks={taggedTasks} />
    </>
  );
}

export default DashBoard;
