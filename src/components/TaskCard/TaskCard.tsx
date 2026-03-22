import styles from "./TaskCard.module.scss";
import clsx from "clsx";
import type { TaskCard, InlineStyles } from "../../types/ui.types";
import { YMDToDateMs } from "../../utils/convertDate";
import { Link } from "react-router";

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
          <Link className={styles.cardButton} to={`update/task/${task.id}`}>
            <img
              className={styles.cardIcon}
              src="/icons/edit.svg"
              alt="редактировать"
            />
          </Link>
          <button
            className={styles.cardButton}
            onClick={() => handleDeleteCard(task)}
          >
            <img
              className={styles.cardIcon}
              src="/icons/close.svg"
              alt="удалить"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
