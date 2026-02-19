import React, { useState } from "react";
import styles from "./Forms.module.scss";
import type { Tag } from "../../types/data.types";
import type { onChangeFunc, filterFunc } from "../../types/forms.types";

type SearchDropdownProps<T> = {
  searchInput: null | string;
  inputName: string;
  value: string;
  onChange: onChangeFunc;
  items: Array<Tag>;
  filterFunc: filterFunc;
  isRequired: boolean;
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
  optText,
}: SearchDropdownProps<T>) {
  let filteredItems = searchInput
    ? items.filter((item) =>
        filterFunc(item).toLowerCase().includes(searchInput.toLowerCase())
      )
    : items;
  if (filteredItems.length == 0) {
    if (isRequired) {
      filteredItems = items;
    } else {
      return <div>{optText}</div>;
    }
  }

  return (
    <select
      className={styles.formSelect}
      name={inputName}
      required
      value={value}
      onChange={(e) => onChange(inputName, { id: Number(e.target.value) })}
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
