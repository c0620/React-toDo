import { useTaggedTasks } from "./TaskManager";

export function Progress() {
  const tagged = useTaggedTasks();
  const maxCols = 2;

  let taskRows = [];
  let taskLines = [];

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
    <div>
      <h2>Прогресс по задачам</h2>
      <div style={{ display: "flex" }}>{taskRows}</div>
    </div>
  );
}

function TaskColumn({ children }) {
  return <div style={{ width: "100%", border: "1px solid" }}>{children}</div>;
}

function TaskLine({ name, allTasks, completed, color, maxLength }) {
  return (
    <div>
      <p>{name}</p>
      <div
        style={{
          height: "30px",
          width: (allTasks / maxLength) * 100 + "%",
          backgroundColor: color.main,
          position: "relative",
        }}
      >
        <div
          style={{
            height: "30px",
            width: (completed / allTasks) * 100 + "%",
            backgroundColor: color.dark,
            position: "absolute",
            top: "0px",
            left: "0px",
            zIndex: 1,
          }}
        >
          {completed}
        </div>
      </div>
    </div>
  );
}
