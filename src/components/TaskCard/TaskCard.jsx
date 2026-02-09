import styles from "./TaskCard.module.scss";

export default function Card({
  task,
  tag,
  handleClickDone,
  handleDeleteCard,
  handleEditCard,
}) {
  return (
    <div className={styles.Card}>
      <div className={styles.CardInfo}>
        <div className={styles.CardDate}>
          {task.date.toLocaleString("default", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <div style={{ color: tag.color.main }}>{tag.name}</div>
      </div>
      <h3>{task.title}</h3>
      <div>
        <button onClick={() => handleClickDone(task)}>
          {task.done ? "Отменить" : "Выполнить"}
        </button>
        <button onClick={() => handleEditCard(task)}>edit</button>
        <button onClick={() => handleDeleteCard(task)}>Удалить</button>
      </div>
    </div>
  );
}
