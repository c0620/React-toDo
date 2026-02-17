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
      type: "taskAdd" | "taskToggleDone" | "taskEdit" | "taskDelete";
      task: Task;
    }
  | { type: "tagAdd" | "tagEdit" | "tagDelete"; tag: Tag }
  | { type: "tagIncrement"; tag: Tag; count: number };

export type TaggedTask = {
  first: string;
  last: string;
  tasks: Array<Task>;
  color: Color;
  name: string;
};

export type TaggedTasks = Record<Tag["id"], TaggedTask>;
