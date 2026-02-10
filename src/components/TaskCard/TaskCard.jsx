import styles from "./TaskCard.module.scss";
import clsx from "clsx";

export default function Card({
  task,
  tag,
  handleClickDone,
  handleDeleteCard,
  handleEditCard,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <div className={styles.cardDate}>
          {task.date.toLocaleString("default", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <div
          className={styles.cardTag}
          style={{ "--tag-color": tag.color.main }}
        >
          {tag.name}
        </div>
      </div>
      <h3 className={styles.cardTitle}>{task.title}</h3>
      <div className={styles.cardControls}>
        <button
          className={clsx(styles.cardButton, {
            [styles.buttonComplete]: !task.done,
            [styles.buttonCancel]: task.done,
          })}
          onClick={() => handleClickDone(task)}
        >
          {task.done ? "Отменить" : "Выполнить"}
        </button>
        <div className={styles.cardActions}>
          <button
            className={styles.cardButton}
            onClick={() => handleEditCard(task)}
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
