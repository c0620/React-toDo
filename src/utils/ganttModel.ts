import type { Task, TaggedTask, TaggedTasks } from "../types/data.types";
import type {
  Week,
  TaggedWeek,
  GanttTrack,
  GanttSelectedTag,
  GanttCell,
} from "../types/ui.types";
import { YMDToDateMs, dateToYMD } from "./convertDate";

export default function buildWeekGanttTracks(
  taggedTasks: TaggedTasks,
  days: Week,
  selectedTag: GanttSelectedTag
) {
  let tracks = [];

  if (days.length != 7) {
    throw Error("Gantt: wrong week range");
  }
  for (const [id, tagged] of Object.entries(taggedTasks)) {
    const isSelected = selectedTag == null || +id == selectedTag;

    const segment = buildWeekSegment(days, tagged);
    if (!segment) {
      continue;
    }

    buildSegmentTasks(tagged.tasks, segment, days);
    const row = +id;
    const track = buildGanttTrack(
      segment,
      days,
      row,
      tagged.color,
      isSelected,
      tagged.tasks
    );

    tracks.push(track);
  }

  return tracks;
}

function buildGanttTrack(
  segment: TaggedWeek,
  days: Week,
  row: GanttTrack["row"],
  color: GanttTrack["color"],
  isSelected: boolean,
  tasks: Array<Task>
): GanttTrack {
  const ganttTrack: GanttTrack = {
    cells: [],
    row,
    opacity: isSelected ? "100%" : "30%",
    color,
  };
  const weekTasks = segment.tasks;
  if (weekTasks.length == 0) {
    throw Error("Gantt: tagged in the scope of a week without tasks");
  }

  let i = 0;
  for (let s = segment.start; s <= segment.end; s++) {
    const dayTasks = [];
    let currentTask = weekTasks[i];
    const weekDayIndex = s - 1;

    if (weekDayIndex > 7) {
      throw Error("Gantt: incorrect segment start/end");
    }

    if (
      i < weekTasks.length &&
      currentTask &&
      +YMDToDateMs(currentTask.date) <= +days[weekDayIndex]!
    ) {
      if (+YMDToDateMs(currentTask.date) <= +days[weekDayIndex]!) {
        while (
          i < weekTasks.length &&
          currentTask &&
          +YMDToDateMs(currentTask.date) <= +days[weekDayIndex]!
        ) {
          dayTasks.push(currentTask);
          i++;
          currentTask = weekTasks[i];
        }
      }
    } else {
      if (ganttTrack.cells.length != 0) {
        let prev = ganttTrack.cells.at(-1);
        if (prev) {
          dayTasks.push(...prev.tasks);
        }
      } else {
        let prev = searchPrevWeekLastTasks(tasks, days[0]);
        if (prev) {
          dayTasks.push(...prev);
        }
      }
    }

    const cell: GanttCell = {
      isStart: false,
      isEnd: false,
      tasks: dayTasks,
      column: s,
    };

    if (!segment.lstart && s == segment.start) {
      cell.isStart = true;
    }
    if (!segment.lend && s == segment.end) {
      cell.isEnd = true;
    }

    ganttTrack.cells.push(cell);
  }

  return ganttTrack;
}

function buildWeekSegment(days: Week, tagged: TaggedTask): TaggedWeek | null {
  const segment: TaggedWeek = {
    lstart: false, //add enum for flat/round end
    lend: false,
    tasks: [],
    start: 0,
    end: 0,
  };

  let YMDDays = days.map((day) => dateToYMD(day));
  let YMDFirst = tagged.first;
  let YMDLast = tagged.last;

  let dayFirst = YMDToDateMs(tagged.first);
  let dayLast = YMDToDateMs(tagged.last);

  const startWeek = days[0];
  const endWeek = days[6];

  if (YMDDays.indexOf(YMDFirst) != -1) {
    segment.start = YMDDays.indexOf(YMDFirst) + 1;
  } else {
    //tag starts not this week (earlier or later)
    if (dayFirst < +startWeek) {
      //tag lasts longer then a week & starts before this week
      segment.start = 1; //from monday
      segment.lstart = true; //flat end
    } else return null; //tag starts after this week
  }

  if (YMDDays.indexOf(YMDLast) != -1) {
    //tag ends this week
    segment.end = YMDDays.indexOf(YMDLast) + 1;
  } else {
    //tag ends not this week
    if (dayLast > +endWeek) {
      //tag ends after this week
      segment.end = 7; //till sunday
      segment.lend = true; //flat end
    } else return null; //tag ends before this week
  }
  return segment;
}

function buildSegmentTasks(
  tasks: TaggedTask["tasks"],
  segment: TaggedWeek,
  days: Week
) {
  const startWeek = days[0];
  const endWeek = days[6];
  const weekTasks = tasks.filter(
    (task) =>
      +YMDToDateMs(task.date) >= +startWeek &&
      +YMDToDateMs(task.date) <= +endWeek
  );

  if (weekTasks.length != 0) {
    if (
      segment.lstart &&
      weekTasks[0] &&
      +YMDToDateMs(weekTasks[0].date) != +days[0]
    ) {
      const prev = searchPrevWeekLastTasks(tasks, days[0]);
      if (prev) {
        weekTasks.unshift(...prev);
      }
    }
  } else {
    const prev = searchPrevWeekLastTasks(tasks, days[0]);
    if (prev) {
      weekTasks.unshift(...prev);
    }
  }
  segment.tasks = weekTasks;
}

function searchPrevWeekLastTasks(
  tasks: Array<Task>,
  monday: Date
): Array<Task> | false {
  let previousTasks: Array<Task> = [];
  for (let task of tasks) {
    if (YMDToDateMs(task.date) >= +monday) {
      return previousTasks;
    }
    if (previousTasks[0]) {
      if (YMDToDateMs(task.date) != YMDToDateMs(previousTasks[0].date)) {
        previousTasks = [task];
      } else {
        previousTasks.push(task);
      }
    } else {
      previousTasks.push(task);
    }
  }
  return false;
}
