import type { Color, Month, Tag, TaggedTasks } from "./task.types";
import type { Task } from "./task.types";

export type Week = [Date, Date, Date, Date, Date, Date, Date];

export interface ProgressTaskLine {
  name: string;
  allTasks: number;
  completed: number;
  color: Color;
  maxLength: number;
}

export type InlineStyles = React.CSSProperties &
  Record<`--${string}`, string | number>;

interface CardHandler {
  (task: Task): void;
}

export interface OnTrackClick {
  (tagId: Tag["id"]): void;
}
export type GanttSelectedTag = null | Tag["id"];

export interface TaskCard {
  task: Task;
  tag: Tag;
  handleClickDone: CardHandler;
  handleDeleteCard: CardHandler;
}

export interface TimelineType {
  days: Month; // !temp
  taggedTasks: TaggedTasks;
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
}

export interface TimelineTasksType {
  taggedTasks: TaggedTasks;
  days: Week;
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
  dayIndexStart: number;
}

export interface SwitchWeekType {
  days: Week;
  handleDayIndex: (i: number) => void;
}
