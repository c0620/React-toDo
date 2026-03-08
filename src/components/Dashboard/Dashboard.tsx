import { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.scss";
import Gantt from "../Gantt/Gantt";
import { useTasksTagsStore } from "../TaskManager";
import { dateToYMD, YMDToDateMs } from "../../utils/convertDate";
import Card from "../TaskCard/TaskCard";
import type { Tag, Task } from "../../types/data.types";
import type { GanttSelectedTag } from "../../types/ui.types";
import { sortTasksByDate } from "../../utils/tasksFormatting";

function Dashboard() {
  const context = useTasksTagsStore();

  const [localTasksTags, setLocalTasksTags] = useState({
    tasks: sortTasksByDate(context.tasks),
    tags: context.tags,
  });

  const [selectedTag, setSelectedTag] = useState<GanttSelectedTag>(null);

  useEffect(() => {
    let newLocalTasks = sortTasksByDate(context.tasks);

    if (selectedTag != null) {
      newLocalTasks = filterSelectedTasks(selectedTag, newLocalTasks);
    }

    setLocalTasksTags({
      tasks: newLocalTasks,
      tags: context.tags,
    });
  }, [selectedTag, context.tasks, context.tags]);

  function handleClickDone(task: Task) {
    context.taskToggleDone(task);
  }

  function handleDeleteCard(task: Task) {
    const currentTag = context.tags.find((tag) => tag.id == task.tagId);
    if (!currentTag) {
      throw Error("Dashboard: Wrong Task's tagId");
    }
    const currentTagTasksCount = context.tasks.filter(
      (t) => t.tagId == currentTag.id
    );

    if (currentTagTasksCount.length == 1) {
      context.tagDelete(currentTag);
    }
    context.taskDelete(task);
  }

  function filterSelectedTasks(tagId: Tag["id"], tasks: Array<Task>) {
    let newLocalTasks = tasks.filter((task: Task) => task.tagId == tagId);
    return newLocalTasks;
  }

  function onTrackClick(tagId: Tag["id"]) {
    let newLocalTasks;
    if (selectedTag != null) {
      setSelectedTag(null);
      newLocalTasks = context.tasks;
    } else {
      setSelectedTag(tagId);
      newLocalTasks = filterSelectedTasks(tagId, context.tasks);
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
    </section>
  );
}

export default Dashboard;
