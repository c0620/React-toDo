import type { Color, Month, Tag, TaggedTasks } from "./data.types";
import type { Task } from "./data.types";

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

export interface TracksType {
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

export type TaggedWeek = {
  lstart: boolean;
  lend: boolean;
  tasks: Array<Task>;
  start: number;
  end: number;
};

export type GanttTrack = {
  cells: Array<GanttCell>;
  tagId: number;
  opacity: `${number}%`;
  color: Color;
};

export type GanttCell = {
  isStart: boolean;
  isEnd: boolean;
  tasks: Array<Task>;
  column: number;
};

export type Cell = {
  track: Omit<GanttTrack, "cells">; // row, opacity, color
  cell: GanttCell; // isStart, isEnd, tasks
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
};
