import type { TimelineType } from "../../types/ui.types";
import type { Week, SwitchWeekType } from "../../types/ui.types";
import { useState } from "react";
import styles from "./Gantt.module.scss";
import Tracks from "./Tracks";

export default function Timeline({
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

      <Tracks
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
