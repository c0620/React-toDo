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
      };
    }
    tagged.tasks.push(task);
    taggedTasks[currentTag.id] = tagged;
  }

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
