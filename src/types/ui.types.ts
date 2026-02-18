import type { Color } from "./task.types";

export interface ProgressTaskLine {
  name: string;
  allTasks: number;
  completed: number;
  color: Color;
  maxLength: number;
}

export type ProgressStyles = React.CSSProperties &
  Record<`--${string}`, string | number>;
