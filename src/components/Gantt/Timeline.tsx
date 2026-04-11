import type { TimelineType } from "../../types/ui.types";
import type { Week, SwitchWeekType } from "../../types/ui.types";
import { useState } from "react";
import styles from "./Gantt.module.scss";
import Tracks from "./Tracks";
import { buildWeek, findMonday } from "../../utils/ganttModel";

export default function Timeline({ onTrackClick, selectedTag }: TimelineType) {
  const monday = findMonday(new Date());
  const [dayIndexStart, setDayIndexStart] = useState(0);
  monday.setDate(monday.getDate() + dayIndexStart);
  const week = buildWeek(monday);

  return (
    <div className={styles.timeline}>
      <SwitchWeek
        week={week}
        handleDayIndex={setDayIndexStart}
        dayIndex={dayIndexStart}
      />

      <Tracks
        days={week}
        onTrackClick={onTrackClick}
        selectedTag={selectedTag}
      />
    </div>
  );
}

export function SwitchWeek({ week, handleDayIndex, dayIndex }: SwitchWeekType) {
  const months: string[] = week.reduce<string[]>((acc, day, index, days) => {
    if (index != 0 && days[index - 1]?.getFullYear() != day.getFullYear()) {
      acc[acc.length - 1] += " " + days[index - 1]?.getFullYear();
    }
    if (index == 0 || days[index - 1]?.getMonth() != day.getMonth()) {
      acc.push(day.toLocaleDateString(undefined, { month: "long" }));
    }

    return acc;
  }, []);

  return (
    <div className={styles.switchWeek}>
      <div className={styles.switchWeekControls}>
        <button
          className={styles.switchWeekButton}
          onClick={() => handleDayIndex(dayIndex - 7)}
        >
          {"<"}
        </button>
        <h2 className={styles.switchWeekMonth}>
          {months.join(" — ")} {week[6].getFullYear()}
        </h2>
        <button
          className={styles.switchWeekButton}
          onClick={() => handleDayIndex(dayIndex + 7)}
        >
          {">"}
        </button>
      </div>
      <div className={styles.switchWeekDays}>
        {week.map((day) => (
          <Day day={day} key={day.getUTCDay()} />
        ))}
      </div>
    </div>
  );
}

export function Day({ day }: { day: Date }) {
  let currentDate = new Date(Date.now());

  let style = styles.day;
  if (day.getDay() == 0 || day.getDay() == 6) {
    style = styles.weekend;
  }

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
