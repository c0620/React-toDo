import type { Tag } from "./data.types";

export type onChangeFunc = {
  (field: string, value: number): void;
};

export type FormDataType = Record<string, string>;

export interface TagColorStyles extends React.CSSProperties {
  "--tag-color": string;
  "--tag-color-dark": string;
}

export type filterFunc = {
  (arg: Tag): string;
};

export type TagInput = {
  name: null | string;
  id: null | number;
  color: null | number;
};
