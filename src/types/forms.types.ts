import type { Tag } from "../types/task.types";

export type onChangeFunc = {
  (field: string, value: Pick<Tag, "id">): void;
};

export type FormDataType = Record<string, string>;

export interface TagColorStyles extends React.CSSProperties {
  "--tag-color": string;
  "--tag-color-dark": string;
}

export type filterFunc = {
  (arg: Tag): string;
};
