import * as mock from "./data";
import { useState } from "react";

export default function Gantt() {
  let days = mock.month;
  let tasks = mock.tagged_tasks;

  return (
    <div className="gantt">
      <Timeline days={days} tasks={tasks} />
      <Filter tasks={tasks} />
    </div>
  );
}

function Timeline({ days, tasks }) {
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

  console.log(switchDays);

  return (
    <div>
      <SwitchWeek days={switchDays} handleDayIndex={handleDayIndex} />

      <TimelineTasks tasks={tasks} days={switchDays} />
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

function Track({ id, position, color, isStart = false, isEnd = false }) {
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

function TimelineTasks({ tasks, days }) {
  function calculateDays(tasks, days) {
    let tracks = [];

    for (let tag in tasks) {
      let track = {};
      let task = tasks[tag];

      if (days.indexOf(task.start) != -1) {
        track.start = days.indexOf(task.start) + 1;
      } else {
        if (task.start < days[0]) {
          track.start = 1;
          track.lstart = true;
        } else continue;
      }

      if (days.indexOf(task.end) != -1) {
        track.end = days.indexOf(task.end) + 1;
      } else {
        if (task.end > days[6]) {
          track.end = 7;
          track.lend = true;
        } else continue;
      }

      track.id = tag;
      track.color = "red";

      tracks.push(track);
    }
    return tracks;
  }

  let calculated = calculateDays(tasks, days);

  let rows = calculated.map((calc) => {
    let line = [];

    for (let i = calc.start; i <= calc.end; i++) {
      let start = false;
      let end = false;

      if (i == calc.start && !calc.lstart) {
        start = true;
      }

      if (i == calc.end && !calc.lend) {
        end = true;
      }
      line.push(
        <Track
          id={calc.id}
          position={i}
          color={calc.color}
          isStart={start}
          isEnd={end}
        />
      );
    }
    return line;
  });

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
      {rows}
    </div>
  );
}

function Filter({ tasks, handler }) {
  return <h3>{tasks.length} задач</h3>;
}
