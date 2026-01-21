export let month = {
  jan: [],
};

for (let i = 1; i <= 31; i++) {
  month.jan.push(new Date(2026, 0, i));
}

export let colors = [
  {
    main: "#99A2CE",
    dark: "#5B67A5",
  },
  {
    main: "#B8A5DE",
    dark: "#765EA8",
  },
  {
    main: "#EBA072",
    dark: "#C77442",
  },
  {
    main: "#C3CE92",
    dark: "#959F64",
  },
  {
    main: "#E6C27F",
    dark: "#C9A45E",
  },
  {
    main: "#DEA5A6",
    dark: "#C4797A",
  },
  {
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
    tasks: 2,
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
    tag: user_tags[1],
    title: "Запланировать задачу",
    done: false,
  },
  {
    id: 1,
    date: "2026-01-09",
    tag: user_tags[2],
    title: "Прочитать учебник по сетям целиком и полностью",
    done: true,
  },
  {
    id: 2,
    date: "2026-01-19",
    tag: user_tags[2],
    title: "Сделать пет-проект",
    done: false,
  },
  {
    id: 3,
    date: "2026-01-19",
    tag: user_tags[2],
    title: "Вторая задача на день пета",
    done: false,
  },
  {
    id: 4,
    date: "2026-01-23",
    tag: user_tags[2],
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

console.log(initialTasksTags);

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
  }

  tagged_tasks[user_tasks[i].tag.id].tasks.push(user_tasks[i]);
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
