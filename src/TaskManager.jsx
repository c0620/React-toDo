import { act, createContext, useContext, useMemo, useReducer } from "react";
import { initialTasksTags, colors } from "./data";

const TasksContext = createContext(null);

export function TaskManager({ children }) {
  const [tasksTags, dispatch] = useReducer(tasksReducer, initialTasksTags);

  return (
    <TasksContext.Provider value={{ tasksTags, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksTags() {
  const tasksTagsContext = useContext(TasksContext);
  console.log(tasksTagsContext);
  if (!tasksTagsContext) throw new Error("no context");
  return tasksTagsContext;
}

export function useTaggedTasks() {
  const { tasksTags } = useContext(TasksContext);

  return useMemo(
    () => makeTagged(tasksTags.tasks, tasksTags.tags),
    [tasksTags.tasks, tasksTags.tags]
  );
}

function tasksReducer(tasksTags, action) {
  switch (action.type) {
    case "taskAdd": {
      // !!! tasksReducer({ type: "tagEdit", count: 1, tag: action.task.tag });
      return {
        ...tasksTags,
        tasks: [...tasksTags.tasks, action.task],
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
      const newTasks = tasksTags.tasks.filter(
        (task) => task.id != action.task.id
      );
      return { ...tasksTags, tasks: newTasks };
    }

    case "tagAdd": {
      const nextID = tasksTags.tags[tasksTags.tags.length - 1].id + 1;
      const nextTag = {
        id: nextID,
        color: action.tag.color ? action.tag.color : colors[nextID],
        name: action.tag.name,
      };
      return { ...tasksTags, tags: [...tags, nextTag] };
    }

    case "tagEdit": {
      const newTags = tasksTags.tags.map((tag) => {
        if (tag.id == action.tag.id) {
          return { ...tag, tasks: tag.tasks + action.count };
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
      throw Error("unknown action with reducer");
  }
}

function makeTagged(user_tasks) {
  let tagged_tasks = {};

  for (let i = 0; i < user_tasks.length; i++) {
    if (user_tasks[i].tag.id in tagged_tasks) {
      const task = tagged_tasks[user_tasks[i].tag.id];

      if (+user_tasks[i].date < +task.first) {
        task.first = user_tasks[i].date;
      }
      if (+user_tasks[i].date > +task.last) {
        task.last = user_tasks[i].date;
      }
    } else {
      tagged_tasks[user_tasks[i].tag.id] = {};
      tagged_tasks[user_tasks[i].tag.id].first = user_tasks[i].date;
      tagged_tasks[user_tasks[i].tag.id].last = user_tasks[i].date;
      tagged_tasks[user_tasks[i].tag.id].tasks = [];
      tagged_tasks[user_tasks[i].tag.id].color = user_tasks[i].tag.color;
    }

    tagged_tasks[user_tasks[i].tag.id].tasks.push(user_tasks[i]);
  }

  return tagged_tasks;
}
