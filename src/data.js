export let month = {
  jan: [],
};

for (let i = 1; i <= 31; i++) {
  month.jan.push(new Date(2026, 0, i));
}

export let colors = [
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

let user_tags = [
  {
    id: 0,
    name: "длинная цель",
    tasks: 0,
  },
  {
    id: 1,
    name: "работа",
    tasks: 1,
  },
  {
    id: 2,
    name: "учёба",
    tasks: 4,
  },
];

for (let i = 0; i < user_tags.length; i++) {
  if (!("color" in user_tags[i])) {
    user_tags[i].color = colors[i];
  }
}

let user_tasks = [
  {
    id: 0,
    date: "2026-01-02",
    tagId: user_tags[1].id,
    title: "Запланировать задачу",
    done: false,
  },
  {
    id: 1,
    date: "2026-01-09",
    tagId: user_tags[2].id,
    title: "Прочитать учебник по сетям целиком и полностью",
    done: true,
  },
  {
    id: 2,
    date: "2026-01-19",
    tagId: user_tags[2].id,
    title: "Сделать пет-проект",
    done: false,
  },
  {
    id: 3,
    date: "2026-01-19",
    tagId: user_tags[2].id,
    title: "Вторая задача на день пета",
    done: false,
  },
  {
    id: 4,
    date: "2026-01-23",
    tagId: user_tags[2].id,
    title: "Задача на день после пета",
    done: false,
  },
];

let tagged_tasks = {
  //   user_tags[0], {
  //   start: Date(),
  //   end: Date(),
  //   tasks: [user_tasks],
  //}
};

export const initialTasksTags = {
  tasks: user_tasks,
  tags: user_tags,
};

for (let i = 0; i < user_tasks.length; i++) {
  if (user_tasks[i].tagId in tagged_tasks) {
    const task = tagged_tasks[user_tasks[i].tagId];

    if (+user_tasks[i].date < +task.first) {
      task.first = user_tasks[i].date;
    }
    if (+user_tasks[i].date > +task.last) {
      task.last = user_tasks[i].date;
    }
  } else {
    tagged_tasks[user_tasks[i].tagId] = {};
    tagged_tasks[user_tasks[i].tagId].first = user_tasks[i].date;
    tagged_tasks[user_tasks[i].tagId].last = user_tasks[i].date;
    tagged_tasks[user_tasks[i].tagId].tasks = [];
  }

  tagged_tasks[user_tasks[i].tagId].tasks.push(user_tasks[i]);
}

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
