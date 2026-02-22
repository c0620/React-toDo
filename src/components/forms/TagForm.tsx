import { colors } from "../../data";
import React, { useRef, useState, type FormEvent } from "react";
import { useTasksTags } from "../TaskManager";
import { SearchDropdown } from "./SearchDropdown";
import clsx from "clsx";
import styles from "./Forms.module.scss";
import type { Tag } from "../../types/data.types";
import type { TagColorStyles, FormDataType } from "../../types/forms.types";

export function AddEditTag() {
  const context = useTasksTags();
  const tags = context.tasksTags.tags;

  const [tagInput, setTagInput] = useState({
    name: tags[0]?.name ?? null,
    id: tags[0]?.id ?? null,
  });

  let colorPickers = colors.map((color) => (
    <>
      <input
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
      />
    </>
  ));

  function onTagSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formObject = Object.fromEntries(form.entries()) as FormDataType;

    if (!formObject.color || !tagInput.name) {
      throw Error("Missing Tag form fields");
    }

    const colorId = formObject.color;
    const tagColor = colors.find((color) => color.id == +colorId);

    if (!tagColor) {
      throw Error("TagForm: Wrong Tag Id");
    }

    if (tagInput.id !== null) {
      context.dispatch({
        type: "tagEdit",
        tag: {
          id: tagInput.id,
          color: tagColor,
          name: tagInput.name,
        },
      });
    } else {
      context.dispatch({
        type: "tagAdd",
        tag: {
          color: tagColor,
          name: tagInput.name,
        },
      });
    }
  }

  function onIdChange(fieldName: string, id: number) {
    const inputTag = tags.filter((t) => t.id == id)[0];
    if (inputTag) {
      setTagInput({ name: inputTag.name, id: inputTag.id });
    }
  }

  function onNameChange(name: string) {
    const inputTag = tags.filter((t) => t.name == name)[0];
    if (inputTag) {
      setTagInput({ name: inputTag.name, id: inputTag.id });
    } else {
      setTagInput({ name: name, id: null });
    }
  }

  return (
    <form className={styles.form} onSubmit={onTagSubmit}>
      <fieldset className={styles.formSet}>
        <label className={styles.formLabel}>
          Название цели
          <input
            className={clsx(
              tagInput.id ? styles.formDInput : styles.formTInput
            )}
            type="text"
            name="name"
            onChange={(e) => onNameChange(e.target.value)}
            value={tagInput.name ?? ""}
          />
          <SearchDropdown
            searchInput={tagInput.name}
            inputName={"tag"}
            value={tagInput.id ?? 0}
            onChange={onIdChange}
            items={tags}
            filterFunc={(arg: Tag) => arg.name}
            isRequired={false}
            optText="Добавление новой цели"
          />
        </label>
      </fieldset>
      <label className={styles.formLabel}>
        Цвет
        <fieldset className={styles.formColors}>{colorPickers}</fieldset>
      </label>

      <button className={styles.formButton} type="submit">
        добавить цель
      </button>
    </form>
  );
}
