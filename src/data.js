export let month = {
  jan: [],
};

for (let i = 1; i <= 31; i++) {
  month.jan.push(new Date(2026, 0, i));
}

export let user_tags = [
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

export let user_tasks = [
  {
    id: 0,
    date: month.jan[1],
    tag: user_tags[1],
    title: "Запланировать задачу",
    done: false,
  },
  {
    id: 1,
    date: month.jan[1],
    tag: user_tags[2],
    title: "Прочитать учебник по сетям целиком и полностью",
    done: true,
  },
  {
    id: 2,
    date: month.jan[9],
    tag: user_tags[2],
    title: "Сделать пет-проект",
    done: false,
  },
  {
    id: 3,
    date: month.jan[9],
    tag: user_tags[2],
    title: "Вторая задача на день пета",
    done: false,
  },
  {
    id: 4,
    date: month.jan[11],
    tag: user_tags[2],
    title: "Задача на день после пета",
    done: false,
  },
];

export let tagged_tasks = {
  //   user_tags[0], {
  //   start: Date(),
  //   end: Date(),
  //   tasks: [user_tasks],
  //}
};

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

export let colorsO = {
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
