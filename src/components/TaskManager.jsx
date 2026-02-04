import { createContext, useContext, useMemo, useReducer } from "react";
import { initialTasksTags, colors } from "../data";
import { YMDToDate, dateToYMD } from "../utils/convertDate";

const TasksContext = createContext(null);

export function TaskManager({ children }) {
  const [tasksTags, dispatch] = useReducer(tasksReducer, initialTasksTags);
  console.log(tasksTags);
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
  const { tasksTags } = useContext(TasksContext);

  return useMemo(
    () => makeTagged(tasksTags.tasks, tasksTags.tags),
    [tasksTags.tasks, tasksTags.tags]
  );
}

function tasksReducer(tasksTags, action) {
  switch (action.type) {
    case "taskAdd": {
      let newTask = action.task;
      newTask.id = tasksTags.tasks[tasksTags.tasks.length - 1].id + 1;

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
      const nextID = tasksTags.tags[tasksTags.tags.length - 1].id + 1;
      const nextTag = {
        id: nextID,
        color: action.tag.color,
        name: action.tag.name,
        tasks: 0,
      };
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
      throw Error("unknown action with reducer");
  }
}

function makeTagged(user_tasks, user_tags) {
  let tagged_tasks = {};
  const tags = user_tags;

  for (let i = 0; i < user_tasks.length; i++) {
    const currentTag = tags.find((t) => t.id == user_tasks[i].tagId);
    if (user_tasks[i].tagId in tagged_tasks) {
      const task = tagged_tasks[user_tasks[i].tagId];

      if (+YMDToDate(user_tasks[i].date) < +YMDToDate(task.first)) {
        task.first = user_tasks[i].date;
      }
      if (+YMDToDate(user_tasks[i].date) > +YMDToDate(task.last)) {
        task.last = user_tasks[i].date;
      }
    } else {
      tagged_tasks[user_tasks[i].tagId] = {};
      tagged_tasks[user_tasks[i].tagId].first = user_tasks[i].date;
      tagged_tasks[user_tasks[i].tagId].last = user_tasks[i].date;
      tagged_tasks[user_tasks[i].tagId].tasks = [];
      tagged_tasks[user_tasks[i].tagId].color = currentTag.color;
      tagged_tasks[user_tasks[i].tagId].name = currentTag.name;
    }

    tagged_tasks[user_tasks[i].tagId].tasks.push(user_tasks[i]);
  }

  return tagged_tasks;
}
