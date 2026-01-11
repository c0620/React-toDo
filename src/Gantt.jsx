import * as mock from "./data";
import { useState } from "react";

export default function Gantt({ tasks }) {
  const days = mock.month;
  let taggedTasks = tasks; //!!!!
  const colors = mock.colors;

  let i = 0;
  for (let id in taggedTasks) {
    taggedTasks[id].color = colors[i % colors.length];
    i++;
  }

  console.log(taggedTasks);

  return (
    <div className="gantt">
      <Timeline days={days} taggedTasks={taggedTasks} />
      <Filter tasks={taggedTasks} />
    </div>
  );
}

function Timeline({ days, taggedTasks }) {
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

function Track({ id, position, taggedTask, isStart = false, isEnd = false }) {
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
  console.log("track", taggedTask);
  console.log(taggedTask.task);
  console.log(taggedTask.task.reduce((d, t) => d && t.done, true));

  if (taggedTask.task.reduce((d, t) => d && t.done, true)) {
    color = taggedTask.color.dark;
  }

  return (
    <div
      style={{
        gridRow: Number(id) + 1,
        gridColumn: position,
        borderRadius: rad,
        backgroundColor: color,
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

function TimelineTasks({ taggedTasks, days, dayIndexStart }) {
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
      };

      console.log(tagged);

      if (days.indexOf(tagged.first) != -1) {
        tagged.start = days.indexOf(tagged.first) + 1;
      } else {
        if (tagged.first < days[0]) {
          tagged.start = 1;
          fillWeek.lstart = true;
        } else continue;
      }

      if (days.indexOf(tagged.last) != -1) {
        tagged.end = days.indexOf(tagged.last) + 1;
      } else {
        if (tagged.last > days[6]) {
          tagged.end = 7;
          fillWeek.lend = true;
        } else continue;
      }

      let weekTasks = tagged.tasks.filter(
        (task) => +task.date >= +days[0] && +task.date <= +days[days.length - 1]
      );

      console.log(days[0]);
      console.log(tagged.start);
      console.log(tagged);
      console.log(weekTasks);

      if (fillWeek.lstart && +weekTasks[0].date != +days[0]) {
        let prev;
        if (weekTasks) {
          let prev_ind = tagged.tasks.indexOf(weekTasks[0]);
          prev = tagged.tasks[prev_ind - 1];
        } else {
          let prevs = tagged.tasks.filter((task) => +task.date < +days[0]);
          prev = prevs[prevs.length - 1];
        }
        weekTasks.unshift(prev);
      }

      let i = 0;
      console.log(weekTasks);
      for (let s = tagged.start; s <= tagged.end; s++) {
        let dayTask = [];
        console.log(days[s - 1]);
        console.log(i);

        if (i < weekTasks.length && +weekTasks[i].date <= +days[s - 1]) {
          if (+weekTasks[i].date == +days[s - 1]) {
            while (i < weekTasks.length && +weekTasks[i].date == +days[s - 1]) {
              console.log("indise");
              dayTask.push(weekTasks[i]);
              i++;
            }
          } else {
            dayTask.push(weekTasks[i]);
            i++;
          }
        } else {
          let prev = fillWeek.tasks[fillWeek.tasks.length - 1].task;
          dayTask.push(...prev);
        }

        console.log(dayTask);
        fillWeek.tasks.push({
          color: tagged.color,
          position: s,
          task: dayTask,
        });
      }
      console.log(fillWeek);
      //tracks.push(tagged);
      tracks.push(fillWeek);
    }
    return tracks;
  }

  function setCalendarLength(calculated) {
    let calendarTracks = [];
    console.log(calculated);
    for (let ind = 0; ind < calculated.length; ind++) {
      let calc = calculated[ind];

      console.log(calc);
      for (let i = 0; i < calc.tasks.length; i++) {
        let start = false;
        let end = false;

        if (i == 0 && !calc.lstart) {
          start = true;
        }

        if (i == calc.tasks.length - 1 && !calc.lend) {
          end = true;
        }
        console.log(calc.tasks[i]);
        calendarTracks.push(
          <Track
            id={calc.row}
            position={calc.tasks[i].position}
            taggedTask={calc.tasks[i]}
            isStart={start}
            isEnd={end}
          />
        );
      }
    }
    return calendarTracks;
  }

  let allTracks = calculateDays(taggedTasks, days);

  console.log(allTracks);
  allTracks = setCalendarLength(allTracks);

  console.log(allTracks);

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
