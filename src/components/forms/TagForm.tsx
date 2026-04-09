import { colors } from "../../data";
import React, {
  useRef,
  useState,
  useEffect,
  type FormEvent,
  type MouseEvent,
} from "react";
import { useTasksTagsStore } from "../taskManager";
import { SearchDropdown } from "./SearchDropdown";
import clsx from "clsx";
import styles from "./Forms.module.scss";
import type { Tag } from "../../types/data.types";
import type {
  TagColorStyles,
  FormDataType,
  TagInput,
} from "../../types/forms.types";
import closeIcon from "../../assets/icons/close.svg";
import { showMessage } from "./FormMessage";

export function AddEditTag() {
  const context = useTasksTagsStore();

  const [tagInput, setTagInput] = useState<TagInput>({
    name: null,
    id: null,
    color: null,
  });
  const [matchTags, setMatchTags] = useState<Tag[] | null>(context.tags);

  const message = useRef<HTMLDivElement>(null);

  let colorPickers = colors.map((color) => (
    <input
      key={color.id}
      className={styles.tagColor}
      type="radio"
      style={
        {
          "--tag-color": color.main,
          "--tag-color-dark": color.dark,
        } as TagColorStyles
      }
      value={color.id}
      name="color"
      onChange={() => setTagInput({ ...tagInput, color: color.id })}
      checked={color.id === tagInput.color}
    />
  ));

  function onTagSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formObject = Object.fromEntries(form.entries()) as FormDataType;

    if (!formObject.color || !tagInput.name) {
      showMessage("Ошибка: заполнены не все поля", message);
      throw Error("Missing Tag form fields");
    }

    const colorId = formObject.color;
    const tagColor = colors.find((color) => color.id == +colorId);

    if (!tagColor) {
      throw Error("TagForm: Wrong Tag Id");
    }

    if (tagInput.id !== null) {
      context.tagEdit({
        id: tagInput.id,
        color: tagColor,
        name: tagInput.name,
      });
      showMessage("Цель отредактирована!", message);
    } else {
      context.tagAdd({
        color: tagColor,
        name: tagInput.name,
      });
      showMessage("Цель добавлена!", message);
    }

    setTagInput({ name: null, id: null, color: null });
  }

  function onNameChange(name: string) {
    const matches = context.tags.filter(
      (tag) => tag.name.toLowerCase().indexOf(name.toLowerCase()) == 0
    );
    setTagInput({ ...tagInput, name: name });

    if (matches.length == 0) {
      if (tagInput.id == null) {
        setMatchTags(null);
      }
    } else {
      setMatchTags(matches);
    }
    console.log(tagInput);
  }

  function onTagClick(e: MouseEvent, tag: Tag) {
    e.preventDefault();
    if (tagInput.id == tag.id) {
      setTagInput({ name: tag.name, id: null, color: tagInput.color });
    } else {
      setTagInput({ name: tag.name, id: tag.id, color: tag.color.id });
    }
  }

  return (
    <>
      <form className={styles.tag} onSubmit={onTagSubmit}>
        <fieldset className={styles.formSet}>
          <label className={styles.formLabel}>
            Название цели
            <input
              className={styles.formTInput}
              type="text"
              name="name"
              onChange={(e) => onNameChange(e.target.value)}
              value={tagInput.name ?? ""}
            />
            {matchTags && (
              <div
                className={styles.tagHints}
                onWheel={(e) => {
                  if (Math.abs(e.deltaX) === 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
                {matchTags?.map((m) => (
                  <button
                    className={styles.tagButton}
                    onClick={(e) => onTagClick(e, m)}
                    key={m.id}
                  >
                    {m.name}
                    {tagInput?.id == m.id ? (
                      <img
                        src={closeIcon}
                        alt="удалить"
                        className={styles.tagIcon}
                      ></img>
                    ) : (
                      ""
                    )}
                  </button>
                ))}
              </div>
            )}
          </label>
        </fieldset>
        <label className={styles.formLabel}>
          Цвет
          <fieldset className={styles.formColors}>{colorPickers}</fieldset>
        </label>

        <button className={styles.formButton} type="submit">
          {tagInput.id != null ? "редактировать цель" : "добавить цель"}
        </button>
      </form>

      <div className={styles.successClosed} ref={message}></div>
    </>
  );
}
