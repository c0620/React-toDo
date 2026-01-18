import { useState } from "react";

export function AddTask() {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTag, setTaskTag] = useState("");

  function handleTaskName(e) {
    e.preventDefault();
    console.log(taskName, taskDate, taskTag);
  }

  return (
    <div>
      <form onSubmit={handleTaskName}>
        <label>Название задачи</label>
        <input type="text" onChange={(e) => setTaskName(e.target.value)} />
        <label>День выполнения задачи</label>
        <input type="date" onChange={(e) => setTaskDate(e.target.value)} />
        <label>Цель</label>
        <input type="text"></input>
        <button>добавить задачу</button>
      </form>
    </div>
  );
}

function AddTag() {
  return <></>;
}
