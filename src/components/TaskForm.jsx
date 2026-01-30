import { useTasksTags } from "./TaskManager";
import { dateToYMD } from "../utils/convertDate";
import { useRef, useState } from "react";
import { SearchDropdown } from "./SearchDropdown";

export function AddEditTask({ task, handleEditField }) {
  const context = useTasksTags();
  const [searchInput, setSearchInput] = useState(null);
  const formInput = useRef();

  let tags = context.tasksTags.tags;

  const d = task?.date ? dateToYMD(new Date(task.date)) : dateToYMD(new Date());

  function onTaskSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());
    let currentTag = tags.filter((tag) => +formObject.tag == tag.id)[0];
    let taskDate = formObject.date;

    if (task.id == null) {
      context.dispatch({
        type: "taskAdd",
        task: {
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done: false,
        },
      });

      context.dispatch({
        type: "tagIncrement",
        tag: {
          id: currentTag.id,
        },
        count: 1,
      });
    } else {
      context.dispatch({
        type: "taskEdit",
        task: {
          id: task.id,
          date: taskDate,
          tag: currentTag,
          title: formObject.title,
          done: task.done,
        },
      });
    }
  }

  return (
    <div>
      <form onSubmit={onTaskSubmit} ref={formInput}>
        <label>Название задачи</label>
        <input
          type="text"
          name="title"
          required
          value={task ? task.title : ""}
          onChange={(e) => handleEditField("title", e.target.value)}
        />
        <label>День выполнения задачи</label>
        <input
          type="date"
          name="date"
          value={d}
          onChange={(e) => handleEditField("date", e.target.value)}
        />
        <input onChange={(e) => setSearchInput(e.target.value)}></input>
        <SearchDropdown
          inputName={"tag"}
          value={task?.tag ? task.tag.id : ""}
          onChange={handleEditField}
          items={tags}
          searchInput={searchInput}
          filterFunc={(tag) => tag.name}
        />
        <button type="submit">добавить задачу</button>
      </form>
    </div>
  );
}
