import { useTasksTags } from "../TaskManager";
import { dateToYMD } from "../../utils/convertDate";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchDropdown } from "./SearchDropdown";
import styles from "./Forms.module.scss";
import type { Task, Tag } from "../../types/data.types";
import type { FormDataType } from "../../types/forms.types";
import { Link } from "react-router";
import clsx from "clsx";

export function AddEditTask({ task }: { task: Task | null }) {
  const context = useTasksTags();
  let tag = context.tasksTags.tags[0];

  if (!tag) {
    return <div>Добавьте первую цель</div>;
  }

  if (task) {
    tag = context.tasksTags.tags.find((tag) => tag.id == task.tagId);
    if (!tag) {
      throw Error("TaskForm: task without tag");
    }
  }
  const [userInput, setUserInput] = useState({
    title: task ? task.title : "",
    date: task ? task.date : dateToYMD(new Date()),
    tag: tag?.name,
    tagId: tag?.id ?? 0,
  });
  const [completed, setCompleted] = useState(true);
  const [match, setMatch] = useState(true);

  let tags = context.tasksTags.tags;

  function onTaskSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formObject = Object.fromEntries(form.entries()) as FormDataType;

    if (!formObject.tag || !formObject.title || !formObject.date) {
      throw Error("TaskForm: missing Tag form fields");
    }

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

  function handleTagSelect(fieldName: string, id: number) {
    const inputTag = tags.find((t) => t.id == id);
    if (inputTag) {
      setUserInput({
        ...userInput,
        tag: inputTag.name,
        tagId: inputTag.id,
      });
      setMatch(true);
    }
  }

  function handleTagInput(name: string) {
    let matches = tags.filter(
      (tag) => tag.name.toLowerCase().indexOf(name.toLowerCase()) == 0
    );

    matches.length != 0 ? setMatch(true) : setMatch(false);
    console.log(match);

    setUserInput({ ...userInput, tag: name });
  }

  return (
    <form className={styles.task} onSubmit={onTaskSubmit}>
      <fieldset className={styles.formSet}>
        <label className={styles.formLabel}>
          Название задачи
          <input
            className={styles.formTInput}
            type="text"
            name="title"
            required
            value={userInput.title}
            onChange={(e) =>
              setUserInput({ ...userInput, title: e.target.value })
            }
          />
        </label>
        <label className={styles.formLabel}>
          День выполнения задачи
          <input
            className={styles.formTInput}
            type="date"
            name="date"
            value={userInput.date}
            onChange={(e) =>
              setUserInput({ ...userInput, date: e.target.value })
            }
          />
        </label>
      </fieldset>
      <fieldset className={styles.formSet}>
        <label className={styles.formLabel}>
          Цель
          <input
            name="tag"
            className={clsx(match ? styles.formDInput : styles.formDError)}
            onChange={(e) => handleTagInput(e.target.value)}
            value={userInput.tag}
          ></input>
          <SearchDropdown
            inputName={"tag"}
            value={userInput.tagId ?? task?.tagId ?? 1}
            onChange={handleTagSelect}
            items={tags}
            searchInput={userInput.tag}
            filterFunc={(tag) => tag.name}
            isRequired={true}
            completed={completed}
            setCompleted={setCompleted}
          />
        </label>
      </fieldset>
      <button className={styles.formButton} type="submit">
        {task ? "добавить задачу" : "изменить задачу и вернуться к дашборду"}
      </button>
    </form>
  );
}
