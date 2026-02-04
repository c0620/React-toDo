import { useEffect, useRef, useState } from "react";
import "../App.css";
import Gantt from "./Gantt";
import { TaskManager, useTasksTags } from "./TaskManager";
import { dateToYMD, YMDToDate } from "../utils/convertDate";
import { AddEditTask } from "./TaskForm";
import { AddEditTag } from "./TagForm";
import { Progress } from "./Progress";

function Card({
  task,
  tag,
  handleClickDone,
  handleDeleteCard,
  handleEditCard,
}) {
  return (
    <div className="card">
      <div>
        <div>
          {task.date.toLocaleString("default", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <div style={{ color: tag.color.main }}>{tag.name}</div>
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

  const [localTasksTags, setLocalTasksTags] = useState({
    tasks: sortTasks(context.tasksTags.tasks),
    tags: context.tasksTags.tags,
  });

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let newLocalTasks = sortTasks(context.tasksTags.tasks);
    setLocalTasksTags({
      tasks: sortTasks(newLocalTasks),
      tags: context.tasksTags.tags,
    });
  }, [context.tasksTags.tasks, context.tasksTags.tags]);

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
    const currentTag = context.tasksTags.tags.find(
      (tag) => tag.id == task.tagId
    );
    if (currentTag.tasks == 1) {
      context.dispatch({ tag: currentTag, type: "tagDelete" });
    } else {
      context.dispatch({ type: "tagIncrement", count: -1, tag: currentTag });
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
      newLocalTasks = localTasksTags.tasks.slice();
      newLocalTasks.sort((a, b) => {
        if (a.tagId == tagId && b.tagId == tagId) {
          return 0;
        }
        if (a.tagId != tagId && b.tagId == tagId) {
          return 1;
        }
        if (a.tagId == tagId && b.tagId != tagId) {
          return -1;
        }
      });
    }
    setIsClicked(!isClicked);
    setLocalTasksTags({ ...localTasksTags, tasks: newLocalTasks });
  }

  const [taskFields, setTaskFields] = useState(null);

  function handleEditCard(task) {
    setTaskFields({ ...task });
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <Gantt onTrackClick={onTrackClick} selectedTag={selectedTag} />
        <div style={{ flexDirection: "column" }}>
          {localTasksTags.tasks.map((task) => (
            <Card
              task={task}
              tag={localTasksTags.tags.find((tag) => tag.id == task.tagId)}
              handleClickDone={handleClickDone}
              handleDeleteCard={handleDeleteCard}
              handleEditCard={handleEditCard}
            />
          ))}
        </div>
      </div>
      <AddEditTask task={taskFields} />
      <AddEditTag />
      <Progress />
    </>
  );
}

export default Dashboard;
