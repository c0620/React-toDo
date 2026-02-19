import { useTasksTags } from "../TaskManager";
import { dateToYMD } from "../../utils/convertDate";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchDropdown } from "./SearchDropdown";
import styles from "./Forms.module.scss";
import type { Task, Tag } from "../../types/data.types";
import type { FormDataType } from "../../types/forms.types";

export function AddEditTask({ task }: { task: Task }) {
  const context = useTasksTags();
  const [userInput, setUserInput] = useState({
    title: "",
    date: dateToYMD(new Date()),
    tag: "",
  });

  useEffect(() => {
    if (task) {
      const tag = context.tasksTags.tags.find((tag) => tag.id == task.tagId);
      if (tag) {
        setUserInput({
          title: task.title,
          tag: tag.name,
          date: dateToYMD(new Date(task.date)),
        });
      } else {
        throw Error("TaskForm: task without tag");
      }
    }
  }, [task]);

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

  function handleTagChange(fieldName: string, tagObj: Pick<Tag, "id">) {
    const inputTag = tags.find((t) => t.id == tagObj.id);
    if (inputTag) {
      setUserInput({
        ...userInput,
        tag: inputTag.name,
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={onTaskSubmit}>
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
            className={styles.formDInput}
            onChange={(e) =>
              setUserInput({ ...userInput, tag: e.target.value })
            }
            value={userInput.tag}
          ></input>
          <SearchDropdown
            inputName={"tag"}
            value={task?.tagId.toString() ?? "1"}
            onChange={handleTagChange}
            items={tags}
            searchInput={userInput.tag}
            filterFunc={(tag) => tag.name}
            isRequired={true}
          />
        </label>
      </fieldset>

      <button className={styles.formButton} type="submit">
        добавить задачу
      </button>
    </form>
  );
}
