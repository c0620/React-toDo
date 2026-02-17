import { dateToYMD } from "./utils/convertDate.ts";
import type { Month, Color, Tag, Task, TasksTags } from "./types/task.types.ts";

export let month: Month = {
  jan: [],
};

for (let i = 1; i <= 31; i++) {
  month.jan.push(new Date(2026, 1, i));
}

export let colors: Array<Color> = [
  {
    id: 0,
    main: "#99A2CE",
    dark: "#5B67A5",
  },
  {
    id: 1,
    main: "#B8A5DE",
    dark: "#765EA8",
  },
  {
    id: 2,
    main: "#EBA072",
    dark: "#C77442",
  },
  {
    id: 3,
    main: "#C3CE92",
    dark: "#959F64",
  },
  {
    id: 4,
    main: "#E6C27F",
    dark: "#C9A45E",
  },
  {
    id: 5,
    main: "#DEA5A6",
    dark: "#C4797A",
  },
  {
    id: 6,
    main: "#99CEAE",
    dark: "#67997B",
  },
];

let userTags: Array<Tag> = [
  {
    id: 0,
    name: "длинная цель",
    tasks: 0,
    color: colors[0]!,
  },
  {
    id: 1,
    name: "работа",
    tasks: 1,
    color: colors[1]!,
  },
  {
    id: 2,
    name: "учёба",
    tasks: 4,
    color: colors[2]!,
  },
];

let userTasks: Array<Task> = [
  {
    id: 0,
    date: dateToYMD(month.jan[3]!),
    tagId: userTags[1]!.id,
    title: "Запланировать задачу",
    done: false,
  },
  {
    id: 1,
    date: dateToYMD(month.jan[1]!),
    tagId: userTags[2]!.id,
    title: "Прочитать учебник по сетям целиком и полностью",
    done: true,
  },
  {
    id: 2,
    date: dateToYMD(month.jan[7]!),
    tagId: userTags[2]!.id,
    title: "Сделать пет-проект",
    done: false,
  },
  {
    id: 3,
    date: dateToYMD(month.jan[7]!),
    tagId: userTags[2]!.id,
    title: "Вторая задача на день пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
  {
    id: 4,
    date: dateToYMD(month.jan[23]!),
    tagId: userTags[2]!.id,
    title: "Задача на день после пета",
    done: false,
  },
];

let tagged_tasks = {
  //   userTags[0], {
  //   start: Date(),
  //   end: Date(),
  //   tasks: [user_tasks],
  //}
};

export const initialTasksTags: TasksTags = {
  tasks: userTasks,
  tags: userTags,
};

// for (let i = 0; i < user_tasks.length; i++) {
//   const uTask = user_tasks[i];
//   if (uTask && uTask.tagId in tagged_tasks) {
//     const task = tagged_tasks[uTask.tagId];

//     if (+user_tasks[i].date < +task.first) {
//       task.first = user_tasks[i].date;
//     }
//     if (+user_tasks[i].date > +task.last) {
//       task.last = user_tasks[i].date;
//     }
//   } else {
//     tagged_tasks[user_tasks[i].tagId] = {};
//     tagged_tasks[user_tasks[i].tagId].first = user_tasks[i].date;
//     tagged_tasks[user_tasks[i].tagId].last = user_tasks[i].date;
//     tagged_tasks[user_tasks[i].tagId].tasks = [];
//   }

//   tagged_tasks[user_tasks[i].tagId].tasks.push(user_tasks[i]);
// }

let colorsO = {
  blue: "#99A2CE",
  blueD: "#5B67A5",
  purple: "#B8A5DE",
  purpleD: "#765EA8",
  orange: "#EBA072",
  orangeD: "#C77442",
  green: "#C3CE92",
  greenD: "#959F64",
  yellow: "#E6C27F",
  yellowD: "#C9A45E",
  red: "#DEA5A6",
  redD: "#C4797A",
  turquoise: "#99CEAE",
  turquoiseD: "#67997B",
};
