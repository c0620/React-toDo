import type { RefObject } from "react";
import styles from "./Forms.module.scss";

export function showMessage(
  text: string,
  message: RefObject<HTMLDivElement | null>
) {
  if (message.current) {
    message.current.className = styles.successOpen as string;
    message.current.textContent = text;
  }

  setTimeout(() => {
    if (message.current) {
      message.current.className = styles.successClosed as string;
    }
  }, 2000);
}
