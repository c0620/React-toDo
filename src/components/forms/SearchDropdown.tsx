import React, { useEffect, useState } from "react";
import styles from "./Forms.module.scss";
import type { Tag } from "../../types/data.types";
import type { onChangeFunc, filterFunc } from "../../types/forms.types";

type SearchDropdownProps<T> = {
  searchInput: null | string;
  inputName: string;
  value: number;
  onChange: onChangeFunc;
  items: Array<Tag>;
  filterFunc: filterFunc;
  isRequired: boolean;
  completed?: boolean;
  setCompleted?: Function;
  optText?: string;
};

export function SearchDropdown<T>({
  searchInput,
  inputName,
  value,
  onChange,
  items,
  filterFunc,
  isRequired,
  completed,
  setCompleted,
  optText,
}: SearchDropdownProps<T>) {
  let filteredItems = searchInput
    ? items.filter((item) =>
        filterFunc(item).toLowerCase().includes(searchInput.toLowerCase())
      )
    : items;

  if (filteredItems.length == 0 && !isRequired) {
    return <div>{optText}</div>;
  }

  if (
    filteredItems.length == 0 ||
    (filteredItems.length == 1 &&
      filteredItems[0]?.name.toLowerCase() == searchInput)
  ) {
    filteredItems = items;
  }

  useEffect(() => {
    if (setCompleted) {
      if (isRequired && !completed && filteredItems.length == 1) {
        setCompleted(true);
        onChange(inputName, filteredItems[0]!.id);
      } else {
        if (isRequired && searchInput == "") {
          setCompleted(false);
        }
      }
    }
  }, [searchInput]);

  return (
    <select
      className={styles.formSelect}
      name={inputName}
      required
      value={value}
      onChange={(e) => onChange(inputName, Number(e.target.value))}
    >
      {filteredItems.map((item) => {
        return (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}
