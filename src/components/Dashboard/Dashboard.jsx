import { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.scss";
import Gantt from "../Gantt/Gantt";
import { TaskManager, useTasksTags } from "../TaskManager";
import { dateToYMD, YMDToDate } from "../../utils/convertDate";
import { AddEditTask } from "../Forms/TaskForm";
import { AddEditTag } from "../Forms/TagForm";
import { Progress } from "../Progress/Progress";
import Card from "../TaskCard/TaskCard";

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
    <div className={styles.container}>
      <div className={styles.navigation}>
        <h1 className={styles.navigationHeader}>Планировщик задач</h1>
        <div className={styles.navigationNav}>Дашборд +</div>
      </div>

      <section className={styles.dashboard}>
        <Gantt onTrackClick={onTrackClick} selectedTag={selectedTag} />
        <div className={styles.cards}>
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
      </section>
      <section>
        <Progress />
        <div>
          <AddEditTask task={taskFields} />
          <AddEditTag />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
