import type { TracksType, Cell, GanttCell } from "../../types/ui.types";
import type { TaggedTasks, TaggedTask, Task } from "../../types/data.types";
import { YMDToDateMs, dateToYMD } from "../../utils/convertDate";
import styles from "./Gantt.module.scss";
import buildWeekGanttTracks from "../../utils/ganttModel";
import { useEffect, useState, useRef, type ReactElement } from "react";
import { createPortal } from "react-dom";

export default function Tracks({
  taggedTasks,
  days,
  onTrackClick,
  selectedTag,
}: TracksType) {
  const tracks = buildWeekGanttTracks(taggedTasks, days, selectedTag);
  const componentTracks: any = [];

  for (const track of tracks) {
    track.cells.forEach((cell) =>
      componentTracks.push(
        <Cell
          track={track}
          cell={cell}
          onTrackClick={onTrackClick}
          selectedTag={selectedTag}
        />
      )
    );
  }
  return <div className={styles.timelineTasks}>{componentTracks}</div>;
}

function Cell({ onTrackClick, track, cell, selectedTag }: Cell) {
  let rad: string;
  const cellRef = useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    if (cellRef.current === null) {
    }
  });

  if (cell.isStart && cell.isEnd) {
    rad = "25px";
  } else if (cell.isStart) {
    rad = "25px 0px 0px 25px";
  } else if (cell.isEnd) {
    rad = "0px 25px 25px 0px";
  } else {
    rad = "0px";
  }

  let color = track.color.main;

  if (cell.tasks.reduce((d, t) => d && t.done, true)) {
    color = track.color.dark;
  }

  return (
    <>
      <div
        onClick={() => {
          onTrackClick(cell.tasks[0]!.tagId);
        }}
        ref={cellRef}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        style={{
          gridRow: track.tagId,
          gridColumn: cell.column,
          borderRadius: rad,
          backgroundColor: color,
          opacity: track.opacity,
        }}
      ></div>
      {selectedTag &&
        selectedTag == track.tagId &&
        cellRef.current &&
        tooltip &&
        createPortal(
          <div
            style={{
              position: "absolute",
              pointerEvents: "none",
              marginTop: "60px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "20px",
              width: "300px",
            }}
          >
            {cell.tasks.map((t) => (
              <p>{t.title}</p>
            ))}
          </div>,
          cellRef.current
        )}
    </>
  );
}
