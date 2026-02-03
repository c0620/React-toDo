import * as mock from "../data";
import { useState } from "react";
import { useTaggedTasks } from "./TaskManager";
import { YMDToDate, dateToYMD } from "../utils/convertDate";

export default function Gantt({ onTrackClick, selectedTag }) {
  const days = mock.month;
  let taggedTasks = useTaggedTasks(); //!!!!
  const colors = mock.colors;

  return (
    <div className="gantt">
      <Timeline
        days={days}
        taggedTasks={taggedTasks}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
      <Filter tasks={taggedTasks} />
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
    <div>
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
    <div className="filter">
      <div>
        <button onClick={() => handleDayIndex(-7)}>{"<"}</button>
        <h2>Январь 2026</h2>
        <button onClick={() => handleDayIndex(7)}>{">"}</button>
      </div>
      <div style={{ display: "flex" }}>
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
    rad = "20px";
  } else if (isStart) {
    rad = "20px 0px 0px 20px";
  } else if (isEnd) {
    rad = "0px 20px 20px 0px";
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
        onTrackClick(taggedTask.task[0].tag.id);
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

  if (
    day.getFullYear() == currentDate.getFullYear() &&
    day.getMonth() == currentDate.getMonth() &&
    day.getDate() == currentDate.getDate()
  ) {
    color = "red";
  }
  return (
    <div
      style={{
        color: color,
        width: "85px",
      }}
    >
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
  dayIndexStart,
}) {
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

      let normDays = days.map((day) => dateToYMD(day));
      let normFirst = tagged.first;
      let normLast = tagged.last;

      let dayFirst = YMDToDate(tagged.first);
      let dayLast = YMDToDate(tagged.last);

      if (normDays.indexOf(normFirst) != -1) {
        tagged.start = normDays.indexOf(normFirst) + 1;
      } else {
        if (+dayFirst < +days[0]) {
          tagged.start = 1;
          fillWeek.lstart = true;
        } else continue;
      }

      if (normDays.indexOf(normLast) != -1) {
        tagged.end = normDays.indexOf(normLast) + 1;
      } else {
        if (+dayLast > +days[6]) {
          tagged.end = 7;
          fillWeek.lend = true;
        } else continue;
      }

      let weekTasks = tagged.tasks.filter(
        (task) =>
          +YMDToDate(task.date) >= +days[0] &&
          +YMDToDate(task.date) <= +days[days.length - 1]
      );

      if (weekTasks.length != 0) {
        if (fillWeek.lstart && +YMDToDate(weekTasks[0].date) != +days[0]) {
          let prev_ind = tagged.tasks.indexOf(weekTasks[0]);
          let prev = tagged.tasks[prev_ind - 1];
          weekTasks.unshift(prev);
        }
      } else {
        let prevs = tagged.tasks.filter(
          (task) => +YMDToDate(task.date) < +days[0]
        );
        let prev = prevs[prevs.length - 1];
        weekTasks.unshift(prev);
      }

      let i = 0;
      for (let s = tagged.start; s <= tagged.end; s++) {
        let dayTask = [];

        if (
          i < weekTasks.length &&
          +YMDToDate(weekTasks[i].date) <= +days[s - 1]
        ) {
          if (+YMDToDate(weekTasks[i].date) == +days[s - 1]) {
            while (
              i < weekTasks.length &&
              +YMDToDate(weekTasks[i].date) == +days[s - 1]
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

  return (
    <div
      style={{
        display: "grid",
        width: "600px",
        height: "300px",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
      }}
    >
      {allTracks}
    </div>
  );
}

function Filter({ tasks, handler }) {
  return <h3>{tasks.length} задач</h3>;
}
