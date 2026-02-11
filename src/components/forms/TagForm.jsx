import { colors } from "../../data";
import { useRef, useState } from "react";
import { useTasksTags } from "../TaskManager";
import { SearchDropdown } from "./SearchDropdown";
import styles from "./Forms.module.scss";

export function AddEditTag() {
  const formInput = useRef();
  const context = useTasksTags();
  const tags = context.tasksTags.tags;

  const [nameInput, setNameInput] = useState("");

  const dropdownTarget = "tag";

  let colorPickers = colors.map((color) => (
    <>
      <input
        className={styles.tagColor}
        type="radio"
        style={{ "--tag-color": color.main, "--tag-color-dark": color.dark }}
        value={color.id}
        name="color"
      />
    </>
  ));

  function onTagSubmit(e) {
    e.preventDefault();
    const form = new FormData(formInput.current);
    const formObject = Object.fromEntries(form.entries());

    const tagColor = colors.find((color) => color.id == formObject.color);

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

  function onNameChange(fieldName, tagObj) {
    setNameInput(tags.filter((t) => t.id == tagObj.id)[0].name);
  }

  return (
    <form className={styles.form} onSubmit={onTagSubmit} ref={formInput}>
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
            value={0}
            onChange={onNameChange}
            items={tags}
            filterFunc={(tag) => tag.name}
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
