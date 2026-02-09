import { useTasksTags } from "../TaskManager";
import { dateToYMD } from "../../utils/convertDate";
import { useEffect, useRef, useState } from "react";
import { SearchDropdown } from "./SearchDropdown";

export function AddEditTask({ task }) {
  const context = useTasksTags();
  const [userInput, setUserInput] = useState({
    title: "",
    date: dateToYMD(new Date()),
    tag: "",
  });
  const formInput = useRef();

  useEffect(() => {
    if (task) {
      const tag = context.tasksTags.tags.find((tag) => tag.id == task.tagId);
      setUserInput({
        title: task.title,
        tag: tag.name,
        date: dateToYMD(new Date(task.date)),
      });
    }
  }, [task]);

  let tags = context.tasksTags.tags;

  function onTaskSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());
    let taskDate = formObject.date;

    if (task == null) {
      context.dispatch({
        type: "taskAdd",
        task: {
          date: taskDate,
          tagId: +formObject.tag,
          title: formObject.title,
          done: false,
        },
      });

      context.dispatch({
        type: "tagIncrement",
        tag: {
          id: +formObject.tag,
        },
        count: 1,
      });
    } else {
      context.dispatch({
        type: "taskEdit",
        task: {
          id: task.id,
          date: taskDate,
          tagId: +formObject.tag,
          title: formObject.title,
          done: task.done,
        },
      });
    }
  }

  function handleTagChange(fieldName, tagObj) {
    setUserInput({
      ...userInput,
      tag: tags.find((t) => t.id == tagObj.id).name,
    });
  }

  return (
    <div>
      <form onSubmit={onTaskSubmit} ref={formInput}>
        <label>Название задачи</label>
        <input
          type="text"
          name="title"
          required
          value={userInput.title}
          onChange={(e) =>
            setUserInput({ ...userInput, title: e.target.value })
          }
        />
        <label>День выполнения задачи</label>
        <input
          type="date"
          name="date"
          value={userInput.date}
          onChange={(e) => setUserInput({ ...userInput, date: e.target.value })}
        />
        <input
          onChange={(e) => setUserInput({ ...userInput, tag: e.target.value })}
          value={userInput.tag}
        ></input>
        <SearchDropdown
          inputName={"tag"}
          value={task?.tag?.id ?? 11}
          onChange={handleTagChange}
          items={tags}
          searchInput={userInput.tag}
          filterFunc={(tag) => tag.name}
          isRequired={true}
        />
        <button type="submit">добавить задачу</button>
      </form>
    </div>
  );
}
