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

  const [filterType, setFilterType] = useState<"all" | "active" | "done">(
    "all"
  );

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
      // newLocalTasks = filterSelectedTasks(tagId, context.tasks);
    }
  }

  function filterActiveTasks(tasks: Array<Task>) {
    let newLocalTasks = tasks.filter((task) => !task.done);
    setLocalTasksTags({ ...localTasksTags, tasks: newLocalTasks });
    setFilterType("active");
  }

  function filterDoneTasks(tasks: Array<Task>) {
    let newLocalTasks = tasks.filter((task) => task.done);
    setLocalTasksTags({ ...localTasksTags, tasks: newLocalTasks });
    setFilterType("done");
  }

  function filterAllTasks() {
    setLocalTasksTags({
      tasks: sortTasksByDate(context.tasks),
      tags: context.tags,
    });
    setFilterType("all");
  }

  return (
    <section className={styles.dashboard}>
      <Gantt onTrackClick={onTrackClick} selectedTag={selectedTag} />
      <div className={styles.right}>
        <div className={styles.filter}>
          <button
            className={[
              styles.filterButton,
              filterType == "all" ? styles.filterButtonSelected : "",
            ].join(" ")}
            onClick={() => filterAllTasks()}
          >
            Все задачи ({context.tasks.length})
          </button>
          <button
            className={[
              styles.filterButton,
              filterType == "active" ? styles.filterButtonSelected : "",
            ].join(" ")}
            onClick={() => filterActiveTasks(sortTasksByDate(context.tasks))}
          >
            Активные ({context.tasks.filter((t) => !t.done).length})
          </button>
          <button
            className={[
              styles.filterButton,
              filterType == "done" ? styles.filterButtonSelected : "",
            ].join(" ")}
            onClick={() => filterDoneTasks(sortTasksByDate(context.tasks))}
          >
            Готовы ({context.tasks.filter((t) => t.done).length})
          </button>
        </div>

        <div className={styles.cards}>
          {localTasksTags.tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              tag={localTasksTags.tags.find((tag) => tag.id == task.tagId)!}
              handleClickDone={handleClickDone}
              handleDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
