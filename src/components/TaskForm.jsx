import { useTasksTags } from "./TaskManager";
import { dateToYMD } from "../utils/convertDate";
import { useRef, useState } from "react";

export function AddEditTask({ task, handleEditField }) {
  const context = useTasksTags();

  let tags = context.tasksTags.tags;

  const d = task?.date ? dateToYMD(new Date(task.date)) : dateToYMD(new Date());

  const formInput = useRef();

  function onTaskSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());
    console.log(formObject);
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
        type: "tagEdit",
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
        <SearchDropdown
          inputName={"tag"}
          value={task?.tag ? task.tag.id : ""}
          onChange={handleEditField}
          items={tags}
        />
        <button type="submit">добавить задачу</button>
      </form>
    </div>
  );
}

function SearchDropdown({ inputName, value, onChange, items }) {
  const [searchInput, setSearchInput] = useState(null);
  let filteredItems = items;
  if ("name" in items[0] && searchInput) {
    filteredItems = items.filter((item) => item.name.includes(searchInput));
  } else if ("title" in items[0] && searchInput) {
    filteredItems = items.filter((item) => item.title.includes(searchInput));
  }

  return (
    <>
      <input onChange={(e) => setSearchInput(e.target.value)}></input>
      <select
        name={inputName}
        required
        value={value}
        onChange={(e) => onChange("tag", { id: Number(e.target.value) })}
      >
        {filteredItems.map((item) => {
          return (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          );
        })}
      </select>
      ;
    </>
  );
}
