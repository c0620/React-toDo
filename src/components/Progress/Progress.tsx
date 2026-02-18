import type React from "react";
import { useTaggedTasks } from "../TaskManager";
import styles from "./Progress.module.scss";
import type { ProgressTaskLine, InlineStyles } from "../../types/ui.types";

export function Progress() {
  const tagged = useTaggedTasks();
  const maxCols = 2;

  let taskRows: Array<React.ReactElement> = [];
  let taskLines: Array<React.ReactElement> = [];

  let taggedCount = Object.keys(tagged).length;
  let linesCount = Math.ceil(taggedCount / maxCols);

  let maxLength = Math.max(...Object.values(tagged).map((t) => t.tasks.length));

  const taggedEnt = Object.entries(tagged);

  taggedEnt.forEach(([tagId, current], index) => {
    let allTasks = current.tasks.length;
    let completed = current.tasks.filter((t) => t.done).length;
    let name = current.name;
    let color = current.color;

    taskLines.push(
      <TaskLine {...{ name, allTasks, completed, color, maxLength }} />
    );

    if (
      ((index + 1) % linesCount == 0 && index != 0) ||
      index == taggedCount - 1
    ) {
      taskRows.push(<TaskColumn>{taskLines}</TaskColumn>);
      taskLines = [];
    }
  });

  return (
    <div className={styles.progress}>
      <h2 className={styles.progressTitle}>Прогресс по задачам</h2>
      <div className={styles.progressTasks}>{taskRows}</div>
    </div>
  );
}

function TaskColumn({ children }: React.PropsWithChildren) {
  return <div className={styles.column}>{children}</div>;
}

function TaskLine({
  name,
  allTasks,
  completed,
  color,
  maxLength,
}: ProgressTaskLine) {
  return (
    <div className={styles.task}>
      <h3 className={styles.taskTitle}>{name}</h3>
      <div
        className={styles.taskAll}
        style={
          {
            "--width-all": (allTasks / maxLength) * 100 + "%",
            "--color-all": color.main,
          } as InlineStyles
        }
      >
        <div
          className={styles.taskCompleted}
          style={
            {
              "--width-completed": (completed / allTasks) * 100 + "%",
              "--color-completed": color.dark,
            } as InlineStyles
          }
        ></div>
        <div className={styles.taskLabel}> {completed}</div>
      </div>
    </div>
  );
}
