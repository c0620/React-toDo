import { YMDToDateMs } from "../utils/convertDate";
import type { Tag, TaggedTasks, Task } from "../types/data.types";

export function makeTagged(
  userTasks: Array<Task>,
  userTags: Array<Tag>
): TaggedTasks {
  const taggedTasks: TaggedTasks = {};
  const tags = userTags;

  for (const task of userTasks) {
    const currentTag = tags.find((t) => t.id === task.tagId);
    if (!currentTag) {
      throw Error("makeTagged: task without tag");
    }
    let tagged = taggedTasks[currentTag.id];

    if (tagged) {
      const taggedFirstDate = YMDToDateMs(tagged.first);
      const taggedLastDate = YMDToDateMs(tagged.last);
      const taskDate = YMDToDateMs(task.date);

      if (taggedFirstDate > taskDate) {
        tagged.first = task.date;
      }
      if (taggedLastDate < taskDate) {
        tagged.last = task.date;
      }
    } else {
      tagged = {
        first: task.date,
        last: task.date,
        tasks: [],
        color: currentTag.color,
        name: currentTag.name,
        row: 0,
      };
    }
    tagged.tasks.push(task);
    taggedTasks[currentTag.id] = tagged;
  }

  denseRows(taggedTasks);

  return taggedTasks;
}

export function sortTasksByDate(tasks: Array<Task>) {
  return [...tasks].sort((a, b) => {
    if (YMDToDateMs(a.date) > YMDToDateMs(b.date)) {
      return 1;
    }
    if (YMDToDateMs(a.date) < YMDToDateMs(b.date)) {
      return -1;
    }
    return 0;
  });
}

function denseRows(taggedTasks: TaggedTasks) {
  const rowsID = new Map();
  for (let id in taggedTasks) {
    const tagged = taggedTasks[id]!;
    const dateStart = YMDToDateMs(tagged.first);
    const dateEnd = YMDToDateMs(tagged.last);
    let setID: number | null = 0;

    for (const [id, dates] of rowsID) {
      if (dates[1] < dateEnd) {
        rowsID.set(id, [dateStart, dateEnd]);
        tagged.row = id;
        console.log(id);
        setID = null;
        break;
      } else {
        setID = id + 1;
      }
    }
    if (setID != null) {
      rowsID.set(setID, [dateStart, dateEnd]);
      console.log(setID);
      tagged.row = setID;
    }
  }
}
