import { colors } from "../../data";
import React, { useRef, useState, type FormEvent } from "react";
import { useTasksTags } from "../TaskManager";
import { SearchDropdown } from "./SearchDropdown";
import styles from "./Forms.module.scss";
import type { Tag } from "../../types/data.types";
import type { TagColorStyles, FormDataType } from "../../types/forms.types";

export function AddEditTag() {
  const context = useTasksTags();
  const tags = context.tasksTags.tags;

  const [nameInput, setNameInput] = useState("");

  const dropdownTarget = "tag";

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

    if (!formObject.color || !formObject.tag || !formObject.name) {
      throw Error("Missing Tag form fields");
    }

    const colorId = formObject.color;
    const tagColor = colors.find((color) => color.id == +colorId);

    if (!tagColor) {
      throw Error("TagForm: Wrong Tag Id");
    }

    if (dropdownTarget in formObject) {
      context.dispatch({
        type: "tagEdit",
        tag: {
          id: +formObject.tag,
          color: tagColor,
          name: formObject.name,
        },
      });
    } else {
      context.dispatch({
        type: "tagAdd",
        tag: {
          color: tagColor,
          name: formObject.name,
        },
      });
    }
  }

  function onNameChange(fieldName: string, tagObj: Pick<Tag, "id">) {
    const inputTag = tags.filter((t) => t.id == tagObj.id)[0];
    if (inputTag) {
      setNameInput(inputTag.name);
    }
  }

  return (
    <form className={styles.form} onSubmit={onTagSubmit}>
      <fieldset className={styles.formSet}>
        <label className={styles.formLabel}>
          Название цели
          <input
            className={styles.formDInput}
            type="text"
            name="name"
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
          />
          <SearchDropdown
            searchInput={nameInput}
            inputName={dropdownTarget}
            value={"0"}
            onChange={onNameChange}
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
