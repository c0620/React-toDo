import { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.scss";
import Gantt from "../Gantt/Gantt";
import { TaskManager, useTasksTags } from "../TaskManager";
import { dateToYMD, YMDToDateMs } from "../../utils/convertDate";
import Card from "../TaskCard/TaskCard";
import type { Tag, Task } from "../../types/data.types";
import type { GanttSelectedTag } from "../../types/ui.types";

function Dashboard() {
  const context = useTasksTags();

  const [localTasksTags, setLocalTasksTags] = useState({
    tasks: sortTasksByDate(context.tasksTags.tasks),
    tags: context.tasksTags.tags,
  });

  const [selectedTag, setSelectedTag] = useState<GanttSelectedTag>(null);

  useEffect(() => {
    let newLocalTasks = sortTasksByDate(context.tasksTags.tasks);

    if (selectedTag != null) {
      newLocalTasks = filterSelectedTasks(selectedTag, newLocalTasks);
    }

    setLocalTasksTags({
      tasks: newLocalTasks,
      tags: context.tasksTags.tags,
    });
  }, [selectedTag, context.tasksTags.tasks, context.tasksTags.tags]);

  function sortTasksByDate(tasks: Array<Task>) {
    return [...tasks].sort((a, b) => {
      if (YMDToDateMs(a.date) > YMDToDateMs(b.date)) {
        return 1;
      }
      if (YMDToDateMs(a.date) < YMDToDateMs(b.date)) {
        return -1;
      }
      return 0;
    });
  }

  function handleClickDone(task: Task) {
    context.dispatch({ type: "taskToggleDone", task: task });
  }

  function handleDeleteCard(task: Task) {
    const currentTag = context.tasksTags.tags.find(
      (tag) => tag.id == task.tagId
    );
    if (!currentTag) {
      throw Error("Dashboard: Wrong Task's tagId");
    }
    if (currentTag.tasks == 1) {
      context.dispatch({ tag: currentTag, type: "tagDelete" });
    } else {
      context.dispatch({ type: "tagIncrement", count: -1, tag: currentTag });
    }
    context.dispatch({ type: "taskDelete", task: task });
  }

  function filterSelectedTasks(tagId: Tag["id"], tasks: Array<Task>) {
    let newLocalTasks = tasks.filter((task: Task) => task.tagId == tagId);
    return newLocalTasks;
  }

  function onTrackClick(tagId: Tag["id"]) {
    let newLocalTasks;
    if (selectedTag != null) {
      setSelectedTag(null);
      newLocalTasks = context.tasksTags.tasks;
    } else {
      setSelectedTag(tagId);
      newLocalTasks = filterSelectedTasks(tagId, context.tasksTags.tasks);
    }
  }

  return (
    <section className={styles.dashboard}>
      <Gantt onTrackClick={onTrackClick} selectedTag={selectedTag} />
      <div className={styles.cards}>
        {localTasksTags.tasks.map((task) => (
          <Card
            task={task}
            tag={localTasksTags.tags.find((tag) => tag.id == task.tagId)!}
            handleClickDone={handleClickDone}
            handleDeleteCard={handleDeleteCard}
          />
        ))}
      </div>
      {/* <section>
        <Progress />
        <div>
          <AddEditTask task={taskFields} />
          <AddEditTag />
        </div>
      </section> */}
    </section>
  );
}

export default Dashboard;
