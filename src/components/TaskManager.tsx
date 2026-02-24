import { createContext, useContext, useMemo, useReducer } from "react";
import { initialTasksTags } from "../data.js";
import { YMDToDateMs } from "../utils/convertDate";
import type {
  Tag,
  TaggedTask,
  TaggedTasks,
  Task,
  TasksTags,
} from "../types/data.types";
import type { Dispatch } from "react";
import type { TaskAction } from "../types/data.types";
import { makeTagged } from "../utils/tasksFormatting.js";

export type TaskContext = {
  tasksTags: TasksTags;
  dispatch: Dispatch<TaskAction>;
};

const TasksContext = createContext<TaskContext | null>(null);

export function TaskManager({ children }: { children: React.ReactNode }) {
  const [tasksTags, dispatch] = useReducer(tasksReducer, initialTasksTags);

  return (
    <TasksContext.Provider value={{ tasksTags, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksTags() {
  const tasksTagsContext = useContext(TasksContext);
  if (!tasksTagsContext) throw new Error("no context");
  return tasksTagsContext;
}

export function useTaggedTasks() {
  const { tasksTags } = useTasksTags();
  return useMemo(
    () => makeTagged(tasksTags.tasks, tasksTags.tags),
    [tasksTags.tasks, tasksTags.tags]
  );
}

function tasksReducer(tasksTags: TasksTags, action: TaskAction): TasksTags {
  switch (action.type) {
    case "taskAdd": {
      const lastTask = tasksTags.tasks.at(-1);
      const newTask: Task = {
        id: lastTask ? lastTask.id + 1 : 0,
        ...action.task,
      };

      return {
        ...tasksTags,
        tasks: [...tasksTags.tasks, newTask],
      };
    }

    case "taskToggleDone": {
      const newTasks = tasksTags.tasks.map((task) => {
        if (task.id == action.task.id) {
          return { ...task, done: !task.done };
        }
        return task;
      });
      return { ...tasksTags, tasks: newTasks };
    }

    case "taskEdit": {
      const newTasks = tasksTags.tasks.map((task) => {
        if (task.id == action.task.id) {
          return action.task;
        }
        return task;
      });
      return { ...tasksTags, tasks: newTasks };
    }

    case "taskDelete": {
      const newTasks = tasksTags.tasks.filter((task) => {
        return task.id != action.task.id;
      });
      return { ...tasksTags, tasks: newTasks };
    }

    case "tagAdd": {
      const nextTag: Tag = {
        color: action.tag.color,
        name: action.tag.name,
        tasks: 0,
        id: 0,
      };

      const lastTag = tasksTags.tags.at(-1);
      nextTag.id = lastTag ? lastTag.id + 1 : 0;

      return { ...tasksTags, tags: [...tasksTags.tags, nextTag] };
    }

    case "tagIncrement": {
      const newTags = tasksTags.tags.map((tag) => {
        if (tag.id == action.tag.id) {
          return { ...tag, tasks: tag.tasks + action.count };
        }
        return tag;
      });
      return { ...tasksTags, tags: newTags };
    }

    case "tagEdit": {
      const newTags = tasksTags.tags.map((tag) => {
        if (tag.id == action.tag.id) {
          return { ...tag, ...action.tag };
        }
        return tag;
      });
      return { ...tasksTags, tags: newTags };
    }

    case "tagDelete": {
      const newTags = tasksTags.tags.filter((tag) => tag.id != action.tag.id);
      return { ...tasksTags, tags: newTags };
    }

    default:
      throw Error("Reducer: unknown action type");
  }
}
