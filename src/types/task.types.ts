export type Month = {
  jan: Array<Date>;
};

export type Hex = `#${string}`;

export type Color = {
  id: number;
  main: Hex;
  dark: Hex;
};

export type Tag = {
  id: number;
  name: string;
  tasks: number;
  color: Color;
};

export type Task = {
  id: number;
  date: string;
  tagId: number;
  title: string;
  done: boolean;
};

export type TasksTags = {
  tasks: Array<Task>;
  tags: Array<Tag>;
};

export type TaskAction =
  | {
      type: "taskToggleDone" | "taskEdit" | "taskDelete";
      task: Task;
    }
  | { type: "taskAdd"; task: Omit<Task, "id"> }
  | { type: "tagEdit"; tag: Omit<Tag, "tasks"> }
  | { type: "tagAdd"; tag: Pick<Tag, "color" | "name"> }
  | { type: "tagDelete"; tag: Pick<Tag, "id"> }
  | { type: "tagIncrement"; tag: Pick<Tag, "id">; count: number };

export type TaggedTask = {
  first: string;
  last: string;
  tasks: Array<Task>;
  color: Color;
  name: string;
  start?: number;
  end?: number;
};

export type FillWeek = {
  lstart: boolean;
  lend: boolean;
  tasks: Array<Task>;
  row: number;
  opacity: `${number}%`;
};

export type TaggedTasks = Record<Tag["id"], TaggedTask>;
