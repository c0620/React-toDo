import type { Tag, TaggedTasks, Task, TasksTags } from "../types/data.types";
import type { Color } from "../types/data.types";

let colors: Array<Color> = [
  { id: 0, main: "#0000FF", dark: "#000099" },
  { id: 1, main: "#00FF00", dark: "#009900" },
  { id: 2, main: "#FF0000", dark: "#990000" },
];

let testUserTags: Array<Tag> = [
  { id: 0, name: "tagID0", color: colors[0]! },
  { id: 1, name: "tagID1", color: colors[1]! },
  { id: 2, name: "tagID2", color: colors[2]! },
];

export const testUserTasks: Array<Task> = [
  {
    id: 0,
    date: "2026-04-08",
    tagId: 0,
    title: "taskID0-tagID0",
    done: false,
  },
  {
    id: 1,
    date: "2026-04-11",
    tagId: 0,
    title: "taskID1-tagID0",
    done: false,
  },
  {
    id: 2,
    date: "2026-04-12",
    tagId: 1,
    title: "taskID2-tagID1",
    done: false,
  },
  {
    id: 3,
    date: "2026-04-11",
    tagId: 2,
    title: "taskID3-tagID2",
    done: false,
  },
  {
    id: 4,
    date: "2026-04-14",
    tagId: 2,
    title: "taskID4-tagID2",
    done: false,
  },
];

export let testTasksTags: TasksTags = {
  tasks: testUserTasks,
  tags: testUserTags,
};

export let testMakeTagged: { tagged: TaggedTasks; maxRow: number } = {
  tagged: {
    "0": {
      first: "2026-04-08",
      last: "2026-04-11",
      tasks: [testUserTasks[0]!, testUserTasks[1]!],
      color: { id: 0, main: "#0000FF", dark: "#000099" },
      name: "tagID0",
      row: 0,
    },
    "1": {
      first: "2026-04-12",
      last: "2026-04-12",
      tasks: [testUserTasks[2]!],
      color: { id: 1, main: "#00FF00", dark: "#009900" },
      name: "tagID1",
      row: 0,
    },
    "2": {
      first: "2026-04-11",
      last: "2026-04-14",
      tasks: [testUserTasks[3]!, testUserTasks[4]!],
      color: { id: 2, main: "#FF0000", dark: "#990000" },
      name: "tagID2",
      row: 1,
    },
  },
  maxRow: 1,
};

export let testWeekGanttTracks = [
  {
    cells: [
      {
        column: 3,
        isEnd: false,
        isStart: true,
        row: 0,
        tasks: [
          {
            date: "2026-04-08",
            done: false,
            id: 0,
            tagId: 0,
            title: "taskID0-tagID0",
          },
        ],
      },
      {
        column: 4,
        isEnd: false,
        isStart: false,
        row: 0,
        tasks: [
          {
            date: "2026-04-08",
            done: false,
            id: 0,
            tagId: 0,
            title: "taskID0-tagID0",
          },
        ],
      },
      {
        column: 5,
        isEnd: false,
        isStart: false,
        row: 0,
        tasks: [
          {
            date: "2026-04-08",
            done: false,
            id: 0,
            tagId: 0,
            title: "taskID0-tagID0",
          },
        ],
      },
      {
        column: 6,
        isEnd: true,
        isStart: false,
        row: 0,
        tasks: [
          {
            date: "2026-04-11",
            done: false,
            id: 1,
            tagId: 0,
            title: "taskID1-tagID0",
          },
        ],
      },
    ],
    tagId: 0,
    opacity: "100%",
    color: { id: 0, main: "#0000FF", dark: "#000099" },
    row: 0,
  },
  {
    cells: [
      {
        column: 7,
        isEnd: true,
        isStart: true,
        row: 0,
        tasks: [
          {
            date: "2026-04-12",
            done: false,
            id: 2,
            tagId: 1,
            title: "taskID2-tagID1",
          },
        ],
      },
    ],
    tagId: 1,
    opacity: "100%",
    color: { id: 1, main: "#00FF00", dark: "#009900" },
    row: 0,
  },
  {
    cells: [
      {
        column: 6,
        isEnd: false,
        isStart: true,
        row: 1,
        tasks: [
          {
            date: "2026-04-11",
            done: false,
            id: 3,
            tagId: 2,
            title: "taskID3-tagID2",
          },
        ],
      },
      {
        column: 7,
        isEnd: false,
        isStart: false,
        row: 1,
        tasks: [
          {
            date: "2026-04-11",
            done: false,
            id: 3,
            tagId: 2,
            title: "taskID3-tagID2",
          },
        ],
      },
    ],
    tagId: 2,
    opacity: "100%",
    color: { id: 2, main: "#FF0000", dark: "#990000" },
    row: 1,
  },
];
