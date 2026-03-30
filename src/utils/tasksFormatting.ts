import { YMDToDateMs } from "../utils/convertDate";
import type { Tag, TaggedTasks, Task } from "../types/data.types";

export function makeTagged(
  userTasks: Array<Task>,
  userTags: Array<Tag>
): { tagged: TaggedTasks; maxRow: number } {
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

  const maxRow = denseRows(taggedTasks);

  return { tagged: taggedTasks, maxRow };
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

function denseRows(tt: TaggedTasks) {
  const rowsID = new Map();
  const taggedTasks = Object.entries(tt).sort(
    ([, a], [, b]) => YMDToDateMs(a.first) - YMDToDateMs(b.first)
  );
  let maxRow = 0;
  for (let [ID, tagged] of taggedTasks) {
    const dateStart = YMDToDateMs(tagged.first);
    const dateEnd = YMDToDateMs(tagged.last);
    let setID: number | null = 0;

    for (const [rID, dates] of rowsID) {
      if (dates[1] < dateStart) {
        rowsID.set(rID, [dateStart, dateEnd]);
        tt[+ID]!.row = rID;
        console.log(tagged.name);
        console.log(rID);
        setID = null;
        break;
      } else {
        setID = rID + 1;
      }
    }
    if (setID != null) {
      rowsID.set(setID, [dateStart, dateEnd]);
      console.log(tagged.name);
      console.log(setID);
      tagged.row = setID;
      if (setID > maxRow) {
        maxRow = setID;
      }
    }
  }
  return maxRow;
}
