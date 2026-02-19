import * as mock from "../../data";
import { useState } from "react";
import { useTaggedTasks, useTasksTags } from "../TaskManager";
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

export default function Gantt({
  onTrackClick,
  selectedTag,
}: {
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
}) {
  const days = mock.month;
  let taggedTasks = useTaggedTasks();

  return (
    <div className={styles.gantt}>
      <Timeline
        days={days}
        taggedTasks={taggedTasks}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
      <Filter />
    </div>
  );
}

function Filter() {
  const context = useTasksTags();
  const tasksTags = context.tasksTags;
  return (
    <>
      <h3>{tasksTags.tasks.length} задач</h3>
      <h3>{tasksTags.tags.length} цели</h3>
    </>
  );
}
