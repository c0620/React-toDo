import React, { useState } from "react";
import styles from "./Forms.module.scss";

type onChangeFunc = {
  (field: string, value: string | number | object): void;
};

type filterFunc = {
  (item: object): string;
};

type userTag = {
  id: number;
  name: string;
  tasks: number;
};

type SearchDropdownProps = {
  searchInput: null | string;
  inputName: string;
  value: string;
  onChange: onChangeFunc;
  items: Array<userTag>;
  filterFunc: filterFunc;
  isRequired: boolean;
  optText?: string;
};

export function SearchDropdown({
  searchInput,
  inputName,
  value,
  onChange,
  items,
  filterFunc,
  isRequired,
  optText,
}: SearchDropdownProps) {
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
