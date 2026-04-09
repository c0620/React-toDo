import { useTasksTagsStore } from "../taskManager";
import { dateToYMD } from "../../utils/convertDate";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SearchDropdown } from "./SearchDropdown";
import styles from "./Forms.module.scss";
import type { Task, Tag } from "../../types/data.types";
import type { FormDataType } from "../../types/forms.types";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { showMessage } from "./FormMessage";

export function AddEditTask({ task }: { task: Task | null }) {
  const context = useTasksTagsStore();

  let tag = context.tags[0];
  const isEmpty = tag == undefined;

  console.log(task);

  if (task) {
    tag = context.tags.find((tag) => tag.id == task.tagId);
    if (!tag) {
      throw Error("TaskForm: task without tag");
    }
  }
  const [userInput, setUserInput] = useState({
    title: task ? task.title : "",
    date: task ? task.date : dateToYMD(new Date()),
    tag: tag ? tag.name : "",
    tagId: tag?.id ?? 0,
  });
  const [completed, setCompleted] = useState(true);
  const [match, setMatch] = useState(true);
  const navigate = useNavigate();
  const message = useRef<HTMLDivElement>(null);

  let tags = context.tags;

  function onTaskSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isEmpty) {
      showMessage("Чтобы создать задачу, добавьте первую цель", message);
      return;
    }

    const form = new FormData(e.currentTarget);
    const formObject = Object.fromEntries(form.entries()) as FormDataType;

    if (!formObject.tag || !formObject.title || !formObject.date) {
      throw Error("TaskForm: missing Tag form fields");
    }

    showMessage("Задача добавлена!", message);

    let taskDate = formObject.date;

    if (task == null) {
      context.taskAdd({
        date: taskDate,
        tagId: +formObject.tag,
        title: formObject.title,
        done: false,
      });
    } else {
      context.taskEdit({
        id: task.id,
        date: taskDate,
        tagId: +formObject.tag,
        title: formObject.title,
        done: task.done,
      });
      navigate("/");
    }
  }

  function handleTagSelect(fieldName: string, id: number) {
    if (!isEmpty) {
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
  }

  function handleTagInput(name: string) {
    if (!isEmpty) {
      let matches = tags.filter(
        (tag) => tag.name.toLowerCase().indexOf(name.toLowerCase()) == 0
      );

      matches.length != 0 ? setMatch(true) : setMatch(false);

      setUserInput({ ...userInput, tag: name });
    }
  }

  return (
    <>
      <form
        className={isEmpty ? styles.emptyTask : styles.task}
        onSubmit={onTaskSubmit}
        onClick={() => {
          if (isEmpty) {
            showMessage("Чтобы создать задачу, добавьте первую цель", message);
          }
        }}
      >
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
          {task ? "изменить задачу и вернуться к дашборду" : "добавить задачу"}
        </button>
      </form>
      <div className={styles.successClosed} ref={message}></div>
    </>
  );
}
