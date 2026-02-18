import * as mock from "../../data";
import { useState } from "react";
import { useTaggedTasks, useTasksTags } from "../TaskManager";
import { YMDToDateMs, dateToYMD } from "../../utils/convertDate";
import styles from "./Gantt.module.scss";
import type {
  FillWeek,
  Tag,
  TaggedTask,
  TaggedTasks,
} from "../../types/task.types";
import type {
  GanttSelectedTag,
  OnTrackClick,
  SwitchWeekType,
  TimelineTasksType,
  TimelineType,
  Week,
} from "../../types/ui.types";

export default function Gantt({
  onTrackClick,
  selectedTag,
}: {
  onTrackClick: OnTrackClick;
  selectedTag: GanttSelectedTag;
}) {
  const days = mock.month;
  let taggedTasks = useTaggedTasks();

  return (
    <div className={styles.gantt}>
      <Timeline
        days={days}
        taggedTasks={taggedTasks}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
      <Filter />
    </div>
  );
}

function Filter() {
  const context = useTasksTags();
  const tasksTags = context.tasksTags;
  return (
    <>
      <h3>{tasksTags.tasks.length} задач</h3>
      <h3>{tasksTags.tags.length} цели</h3>
    </>
  );
}

function Timeline({
  days,
  taggedTasks,
  onTrackClick,
  selectedTag,
}: TimelineType) {
  let mock_days = days.jan;

  const [dayIndexStart, setDayIndexStart] = useState(0);
  let switchDays = mock_days.slice(dayIndexStart, dayIndexStart + 7) as Week; //! temp

  function handleDayIndex(i: number) {
    if (dayIndexStart + i < 0) {
      setDayIndexStart(0);
    } else {
      setDayIndexStart(dayIndexStart + i);
    }
  }

  return (
    <div className={styles.timeline}>
      <SwitchWeek days={switchDays} handleDayIndex={handleDayIndex} />

      <TimelineTasks
        taggedTasks={taggedTasks}
        days={switchDays}
        dayIndexStart={dayIndexStart}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
    </div>
  );
}

function SwitchWeek({ days, handleDayIndex }: SwitchWeekType) {
  return (
    <div className={styles.switchWeek}>
      <div className={styles.switchWeekControls}>
        <button
          className={styles.switchWeekButton}
          onClick={() => handleDayIndex(-7)}
        >
          {"<"}
        </button>
        <h2 className={styles.switchWeekMonth}>Январь 2026</h2>
        <button
          className={styles.switchWeekButton}
          onClick={() => handleDayIndex(7)}
        >
          {">"}
        </button>
      </div>
      <div className={styles.switchWeekDays}>
        {days.map((day) => (
          <Day day={day} />
        ))}
      </div>
    </div>
  );
}

function Day({ day }: { day: Date }) {
  let color = "white";

  let currentDate = new Date(Date.now());

  let style = styles.day;

  if (
    day.getFullYear() == currentDate.getFullYear() &&
    day.getMonth() == currentDate.getMonth() &&
    day.getDate() == currentDate.getDate()
  ) {
    style = styles.dayActive;
  }
  return (
    <div className={style}>
      {day.toLocaleString("default", {
        day: "numeric",
        weekday: "short",
      })}
    </div>
  );
}

function TimelineTasks({
  taggedTasks,
  days,
  onTrackClick,
  selectedTag,
}: TimelineTasksType) {
  function calculateDays(taggedTasks: TaggedTasks, days: Week) {
    let tracks = [];
    let row = 0;

    if (days.length != 7) {
      throw Error("Gantt: wrong week range");
    }
    for (const [id, tagged] of Object.entries(taggedTasks)) {
      let fillWeek: FillWeek = {
        lstart: false, //add enum for flat/round end
        lend: false,
        tasks: [],
        row: row++,
        opacity:
          selectedTag != null ? (+id == selectedTag ? "100%" : "30%") : "100%",
      };

      let normDays = days.map((day) => dateToYMD(day));
      let normFirst = tagged.first;
      let normLast = tagged.last;

      let dayFirst = YMDToDateMs(tagged.first);
      let dayLast = YMDToDateMs(tagged.last);

      const startWeek = days[0];
      const endWeek = days[6];

      if (normDays.indexOf(normFirst) != -1) {
        //tag starts this week
        tagged.start = normDays.indexOf(normFirst) + 1;
      } else {
        //tag starts not this week (earlier or later)
        if (+dayFirst < +days[0]) {
          //tag lasts longer then a week & starts before this week
          tagged.start = 1; //from monday
          fillWeek.lstart = true; //flat end
        } else continue; //tag starts after this week
      }

      if (normDays.indexOf(normLast) != -1) {
        //tag ends this week
        tagged.end = normDays.indexOf(normLast) + 1;
      } else {
        //tag ends not this week
        if (+dayLast > +days[6]) {
          //tag ends after this week
          tagged.end = 7; //till sunday
          fillWeek.lend = true; //flat end
        } else continue; //tag ends before this week
      }

      //if we're here, tagged tasks are in week's scope

      //

      let i = 0;
      for (let s = tagged.start; s <= tagged.end; s++) {
        let dayTask = [];

        if (
          i < weekTasks.length &&
          +YMDToDateMs(weekTasks[i].date) <= +days[s - 1]
        ) {
          if (+YMDToDateMs(weekTasks[i].date) == +days[s - 1]) {
            while (
              i < weekTasks.length &&
              +YMDToDateMs(weekTasks[i].date) == +days[s - 1]
            ) {
              dayTask.push(weekTasks[i]);
              i++;
            }
          } else {
            dayTask.push(weekTasks[i]);
            i++;
          }
        } else {
          if (fillWeek.tasks[fillWeek.tasks.length - 1].length != 0) {
            let prev = fillWeek.tasks[fillWeek.tasks.length - 1].task;
            dayTask.push(...prev);
          }
        }

        fillWeek.tasks.push({
          color: tagged.color,
          position: s,
          task: dayTask,
        });
      }

      //tracks.push(tagged);
      tracks.push(fillWeek);
    }
    return tracks;
  }

  function d(
    tasks: TaggedTask["tasks"],
    fillWeek: FillWeek,
    startWeek: Date,
    endWeek: Date
  ) {
    let weekTasks = tasks.filter(
      (task) =>
        +YMDToDateMs(task.date) >= +startWeek &&
        +YMDToDateMs(task.date) <= +endWeek
    ); //tagged tasks from the scope of a week

    if (weekTasks.length != 0) {
      if (fillWeek.lstart && +YMDToDateMs(weekTasks[0].date) != +days[0]) {
        //if tag starts before this week
        let prev_ind = tasks.indexOf(weekTasks[0]);
        let prev = tasks[prev_ind - 1];
        weekTasks.unshift(prev);
      }
    } else {
      let prevs = tasks.filter((task) => +YMDToDateMs(task.date) < +days[0]);
      let prev = prevs[prevs.length - 1];
      weekTasks.unshift(prev);
    }
    return weekTasks;
  }

  function makeTracks(calculated) {
    let calendarTracks = [];

    for (let ind = 0; ind < calculated.length; ind++) {
      let calc = calculated[ind];

      for (let i = 0; i < calc.tasks.length; i++) {
        let start = false;
        let end = false;

        if (i == 0 && !calc.lstart) {
          start = true;
        }

        if (i == calc.tasks.length - 1 && !calc.lend) {
          end = true;
        }

        calendarTracks.push(
          <Track
            id={calc.row}
            position={calc.tasks[i].position}
            taggedTask={calc.tasks[i]}
            isStart={start}
            isEnd={end}
            onTrackClick={onTrackClick}
            opacity={calc.opacity}
          />
        );
      }
    }
    return calendarTracks;
  }

  let allTracks = calculateDays(taggedTasks, days);

  allTracks = makeTracks(allTracks);

  return <div className={styles.timelineTasks}>{allTracks}</div>;
}

function Track({
  id,
  position,
  taggedTask,
  isStart = false,
  isEnd = false,
  onTrackClick,
  opacity,
}) {
  let rad;
  if (isStart && isEnd) {
    rad = "25px";
  } else if (isStart) {
    rad = "25px 0px 0px 25px";
  } else if (isEnd) {
    rad = "0px 25px 25px 0px";
  } else {
    rad = "0px";
  }

  let color = taggedTask.color.main;

  if (taggedTask.task.reduce((d, t) => d && t.done, true)) {
    color = taggedTask.color.dark;
  }

  return (
    <div
      onClick={() => {
        onTrackClick(taggedTask.task[0].tagId);
      }}
      style={{
        gridRow: Number(id) + 1,
        gridColumn: position,
        borderRadius: rad,
        backgroundColor: color,
        opacity: opacity,
      }}
    ></div>
  );
}
