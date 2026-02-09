import { colors } from "../../data";
import { useRef, useState } from "react";
import { useTasksTags } from "../TaskManager";
import { SearchDropdown } from "./SearchDropdown";

export function AddEditTag() {
  const formInput = useRef();
  const context = useTasksTags();
  const tags = context.tasksTags.tags;

  const [nameInput, setNameInput] = useState("");

  const dropdownTarget = "tag";

  let colorPickers = colors.map((color) => (
    <>
      <style>
        {`
      .C${color.id}[type='radio']::after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: ${color.main};
        content: '';
        display: inline-block;
        visibility: visible;
        border: 2px solid white;
      }

      .C${color.id}[type='radio']:checked::after {
        background-color: ${color.dark};
      }
    `}
      </style>
      <input
        className={`C${color.id}`}
        type="radio"
        style={{ accentColor: color.main }}
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
    <div>
      <form onSubmit={onTagSubmit} ref={formInput}>
        <label>Название цели</label>
        <input
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
        {colorPickers}
        <button type="submit">добавить цель</button>
      </form>
    </div>
  );
}
