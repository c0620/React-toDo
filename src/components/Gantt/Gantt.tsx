import * as mock from "../../data";
import { useState } from "react";
import { useTaggedTasks, useTasksTagsStore } from "../TaskManager";
import { YMDToDateMs, dateToYMD } from "../../utils/convertDate";
import styles from "./Gantt.module.scss";
import Timeline from "./Timeline";
import type {
  Tag,
  TaggedTask,
  TaggedTasks,
  Task,
} from "../../types/data.types";
import type { GanttSelectedTag, OnTrackClick } from "../../types/ui.types";
import { sortTasksByDate } from "../../utils/tasksFormatting";

export default function Gantt({
  onTrackClick,
  selectedTag,
}: {
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
}) {
  const taggedTasks = useTaggedTasks();
  for (const tagId in taggedTasks) {
    if (taggedTasks[tagId]) {
      taggedTasks[tagId].tasks = sortTasksByDate(taggedTasks[tagId]?.tasks);
    }
  }

  return (
    <div className={styles.gantt}>
      <Timeline
        taggedTasks={taggedTasks}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
      <Filter />
    </div>
  );
}

function Filter() {
  const tasksTags = useTasksTagsStore();
  return (
    <>
      <h3>{tasksTags.tasks.length} задач</h3>
      <h3>{tasksTags.tags.length} цели</h3>
    </>
  );
}
