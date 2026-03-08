import { NavLink, useLocation } from "react-router";
import styles from "./PagesController.module.scss";
import { useState } from "react";

const pages = [
  { to: "/", label: "Дашборд" },
  { to: "/e", label: "404" },
  { to: "/update", label: "Добавить задачу/цель" },
];

export default function PagesController() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleController = () => {
    setIsOpen(!isOpen);
  };

  const current = pages.find((p) => p.to === location.pathname) ?? pages[0]!;
  const others = pages.filter((p) => p.to !== current!.to);

  return (
    <nav className={styles.navigation}>
      <NavLink
        to={current.to}
        className={[
          styles.navigationLink!,
          isOpen ? "" : styles.roundLink,
        ].join(" ")}
        end
      >
        {current.label}
        <button className={styles.navigationButton} onClick={toggleController}>
          <img
            className={[
              styles.navigationIcon,
              isOpen ? styles.iconOpen : "",
            ].join(" ")}
            src="./src/assets/icons/arrow.svg"
          />
        </button>
      </NavLink>

      <div
        className={[styles.navigationLinks, isOpen ? "" : styles.closed].join(
          " "
        )}
      >
        {others.map((page) => (
          <NavLink
            key={page.to}
            to={page.to}
            className={styles.navigationLink!}
            onClick={() => setIsOpen(false)}
          >
            {page.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
