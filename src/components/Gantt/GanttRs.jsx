import * as mock from "../../data";
import { useState } from "react";
import { useTaggedTasks, useTasksTags } from "../TaskManager";
import { YMDToDate, dateToYMD } from "../../utils/convertDate";
import styles from "./Gantt.module.scss";

export default function Ad({ onTrackClick, selectedTag }) {
  const days = mock.month;
  let taggedTasks = useTaggedTasks();
  const colors = mock.colors;

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

function Timeline({ days, taggedTasks, onTrackClick, selectedTag }) {
  let mock_days = days.jan;

  const [dayIndexStart, setDayIndexStart] = useState(0);
  let switchDays = mock_days.slice(dayIndexStart, dayIndexStart + 7);

  function handleDayIndex(i) {
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

function SwitchWeek({ days, handleDayIndex }) {
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

function Day({ day }) {
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

function TimelineTasks({ taggedTasks, days, onTrackClick, selectedTag }) {
  function calculateDays(taggedTasks, days) {
    let tracks = [];
    let row = 0;

    for (let tag in taggedTasks) {
      let tagged = taggedTasks[tag];
      let fillWeek = {
        lstart: false,
        lend: false,
        tasks: [],
        row: row++,
        opacity:
          selectedTag != null ? (tag == selectedTag ? "100%" : "30%") : "100%",
      };

      //days in string format
      let normDays = days.map((day) => dateToYMD(day));
      let normFirst = tagged.first; //tagged starts
      let normLast = tagged.last; //tagged ends

      //days in ms format
      let dayFirst = YMDToDate(tagged.first);
      let dayLast = YMDToDate(tagged.last);

      if (normDays.indexOf(normFirst) != -1) {
        //if tagged starts in current week, get the day's of start index
        tagged.start = normDays.indexOf(normFirst) + 1;
      } else {
        //if tagged starts not in current week
        if (+dayFirst < +days[0]) {
          //if tagged starts before current week
          tagged.start = 1;
          //flat start
          fillWeek.lstart = true;
        } else continue; //else pass (start after current week)
      }

      if (normDays.indexOf(normLast) != -1) {
        //if tagged end in current week, get the day's of end index
        tagged.end = normDays.indexOf(normLast) + 1;
      } else {
        //if tagged ends not in current week
        if (+dayLast > +days[6]) {
          //if tagged ends after current week
          tagged.end = 7;
          //flat end
          fillWeek.lend = true;
        } else continue; //else pass (end before current week)
      }

      //current tagged not 100% contains weekTasks (may be gap more than a week)
      let weekTasks = tagged.tasks.filter(
        (task) =>
          +YMDToDate(task.date) >= +days[0] &&
          +YMDToDate(task.date) <= +days[days.length - 1]
      );

      console.log(weekTasks);

      if (weekTasks.length != 0) {
        //if tagged started before week & first task not in monday
        if (fillWeek.lstart && +YMDToDate(weekTasks[0].date) != +days[0]) {
          //get index of first task this week in all tag's tasks
          let prev_ind = tagged.tasks.indexOf(weekTasks[0]);
          //get index of task previous the first one
          let prev = tagged.tasks[prev_ind - 1]; //prev_ind != 0 (lstart = true)
          //add the last of tasks before this week to the start of weekTasks
          weekTasks.unshift(prev);
        }
        // W? missing: what if lstart and weekTasks[0].date == +days[0]?
        // A: do not need to alter weekTasks, the first day only matter in filling empty before actual weekTasks
      } else {
        //get tasks before the week
        // W! cause bug: takes ONLY LAST PREVDAY TASK, so it makes days done even if there's another uncompleted tasks
        // need to change filter to one which more precisely and not to get prev[-1]
        let prevs = tagged.tasks.filter(
          (task) => +YMDToDate(task.date) < +days[0]
        );
        //get the last one of prevs
        let prev = prevs[prevs.length - 1];
        //add the last of tasks before this week to the start of weekTasks
        weekTasks.unshift(prev);
      }
      // W! missing: what if no tasks for a week (tag gap)? (weekTasks.length == 0)

      //

      let i = 0;
      //from start to end day of the week with current tag
      for (let s = tagged.start; s <= tagged.end; s++) {
        //tasks for today
        let dayTask = [];

        //if there are still prev task + tasks for this week
        //ORDERED weekTasks!
        if (
          i < weekTasks.length &&
          +YMDToDate(weekTasks[i].date) <= +days[s - 1] //for why?
        ) {
          //if current task is for the current day, add another tasks for today
          if (+YMDToDate(weekTasks[i].date) == +days[s - 1]) {
            while (
              i < weekTasks.length &&
              +YMDToDate(weekTasks[i].date) == +days[s - 1]
            ) {
              dayTask.push(weekTasks[i]);
              i++;
            }
          } else {
            //just put current weekTasks[i] for today and start a new day
            //W!: what if its not an end of the week, but there are still few tasks for today
            //W!: now id drops all other tasks to the next iter (next day)?;C
            dayTask.push(weekTasks[i]);
            i++;
          }
        } else {
          //if all tasks gone, but tag still lasts this week, complete empty days with prev day's tasks
          if (fillWeek.tasks[fillWeek.tasks.length - 1].task.length != 0) {
            console.log(fillWeek.tasks[fillWeek.tasks.length - 1]);
            let prev = fillWeek.tasks[fillWeek.tasks.length - 1].task;
            dayTask.push(...prev);
          }
        }
        //push day's tasks to the tag week (or less) scope
        fillWeek.tasks.push({
          color: tagged.color,
          position: s, //1-7 grid cell
          task: dayTask,
        });
      }

      //tracks.push(tagged);
      tracks.push(fillWeek);
    }
    return tracks;
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
