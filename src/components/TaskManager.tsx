import { createContext, useContext, useMemo, useReducer } from "react";
import { initialTasksTags } from "../data.js";
import { YMDToDateMs } from "../utils/convertDate";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Tag,
  TaggedTask,
  TaggedTasks,
  Task,
  TasksTags,
} from "../types/data.types";
import type { Dispatch } from "react";
import type { TaskAction } from "../types/data.types";
import { makeTagged, sortTasksByDate } from "../utils/tasksFormatting.js";

type TasksTagsStore = {
  tasks: Task[];
  tags: Tag[];

  taskAdd: (task: Omit<Task, "id">) => void;
  taskToggleDone: (task: Task) => void;
  taskEdit: (task: Task) => void;
  taskDelete: (task: Task) => void;

  tagEdit: (task: Omit<Tag, "tasks">) => void;
  tagAdd: (tag: Pick<Tag, "color" | "name">) => void;
  tagDelete: (tag: Pick<Tag, "id">) => void;
};

export const useTasksTagsStore = create<TasksTagsStore>()(
  persist(
    (set) => ({
      tasks: initialTasksTags.tasks,
      tags: initialTasksTags.tags,

      taskAdd: (task) =>
        set((state) => {
          const tasksIDs = state.tasks.map((t) => t.id);
          let id = 0;
          if (tasksIDs) {
            id = Math.max(...tasksIDs) + 1;
          }
          const newTask: Task = {
            id,
            ...task,
          };

          return {
            tasks: sortTasksByDate([...state.tasks, newTask]),
          };
        }),

      taskEdit: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),

      taskToggleDone: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === task.id ? { ...t, done: !t.done } : t
          ),
        })),

      taskDelete: (task) =>
        set((state) => {
          const newTasks = state.tasks.filter((t) => t.id !== task.id);
          const isTagUsed = newTasks.some((t) => t.tagId === task.tagId);
          const newTags = isTagUsed
            ? state.tags
            : state.tags.filter((tag) => tag.id !== task.tagId);

          return {
            tasks: newTasks,
            tags: newTags,
          };
        }),
      tagAdd: (tag) =>
        set((state) => {
          const last = state.tags.at(-1);

          const nextTag: Tag = {
            ...tag,
            id: last ? last.id + 1 : 0,
          };

          return { tags: [...state.tags, nextTag] };
        }),

      tagEdit: (tag) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === tag.id ? { ...t, ...tag } : t)),
        })),

      tagDelete: (tag) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== tag.id),
        })),
    }),
    { name: "tasksTags-storage" }
  )
);

export function useTaggedTasks() {
  const tasks = useTasksTagsStore((s) => s.tasks);
  const tags = useTasksTagsStore((s) => s.tags);

  return useMemo(() => makeTagged(tasks, tags), [tasks, tags]);
}
