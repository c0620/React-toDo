import styles from "./TaskCard.module.scss";
import clsx from "clsx";
import type { TaskCard, InlineStyles } from "../../types/ui.types";
import { YMDToDateMs } from "../../utils/convertDate";

export default function Card({
  task,
  tag,
  handleClickDone,
  handleDeleteCard,
}: TaskCard) {
  const taskDate = new Date(YMDToDateMs(task.date));

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <div className={styles.cardDate}>
          {taskDate.toLocaleString("default", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <div
          className={styles.cardTag}
          style={{ "--tag-color": tag.color.main } as InlineStyles}
        >
          {tag.name}
        </div>
      </div>
      <h3 className={styles.cardTitle}>{task.title}</h3>
      <div className={styles.cardControls}>
        <button
          className={clsx(
            styles.cardButton,
            !task.done ? styles.buttonComplete : styles.buttonCancel
          )}
          onClick={() => handleClickDone(task)}
        >
          {task.done ? "Отменить" : "Выполнить"}
        </button>
        <div className={styles.cardActions}>
          <button
            className={styles.cardButton}
            onClick={() => {
              throw new Error("Not Implemented");
            }}
          >
            <img src="./src/assets/icons/edit.svg" alt="редактировать" />
          </button>
          <button
            className={styles.cardButton}
            onClick={() => handleDeleteCard(task)}
          >
            <img src="./src/assets/icons/close.svg" alt="удалить" />
          </button>
        </div>
      </div>
    </div>
  );
}
