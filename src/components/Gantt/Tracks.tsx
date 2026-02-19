import type { TracksType, TrackComponent } from "../../types/ui.types";
import type { TaggedTasks, TaggedTask, Task } from "../../types/data.types";
import { YMDToDateMs, dateToYMD } from "../../utils/convertDate";
import styles from "./Gantt.module.scss";
import buildWeekGanttTracks from "../../utils/ganttModel";

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
        <Track track={track} cell={cell} onTrackClick={onTrackClick} />
      )
    );
  }
  return <div className={styles.timelineTasks}>{componentTracks}</div>;
}

function Track({ onTrackClick, track, cell }: TrackComponent) {
  let rad: string;
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
    <div
      onClick={() => {
        onTrackClick(cell.tasks[0]!.tagId);
      }}
      style={{
        gridRow: track.row,
        gridColumn: cell.column,
        borderRadius: rad,
        backgroundColor: color,
        opacity: track.opacity,
      }}
    ></div>
  );
}
