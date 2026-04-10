import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Day, SwitchWeek } from "../components/Gantt/Timeline";
import { buildWeek } from "../utils/ganttModel";

describe("Timeline", async () => {
  test("Day: check class for today", async () => {
    const date = new Date();
    const screen = await render(<Day day={date} />);
    const day = screen.getByText(
      date.toLocaleString("default", {
        day: "numeric",
        weekday: "short",
      })
    );
    await expect.element(day).toHaveClass(/day-active/);
  });

  test("Day: check class for other day", async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const screen = await render(<Day day={date} />);
    const day = screen.getByText(
      date.toLocaleString("default", {
        day: "numeric",
        weekday: "short",
      })
    );
    await expect.element(day).not.toHaveClass(/day-active/);
  });
});
