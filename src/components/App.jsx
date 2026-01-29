import { useEffect, useRef, useState } from "react";
import "../App.css";
import Gantt from "./Gantt";
import { TaskManager, useTasksTags } from "./TaskManager";
import { dateToYMD, YMDToDate } from "../utils/convertDate";
import { AddEditTask } from "./TaskForm";
import { AddEditTag } from "./TagForm";
import { Progress } from "./Progress";

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
    if (task.tag.tasks == 1) {
      context.dispatch({ tag: task.tag, type: "tagDelete" });
    } else {
      context.dispatch({ type: "tagIncrement", count: -1, tag: task.tag });
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
      <AddEditTag />
      <Progress />
    </>
  );
}

export default Dashboard;
