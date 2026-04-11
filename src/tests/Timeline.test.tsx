import { describe, vi, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Timeline, { Day, SwitchWeek } from "../components/Gantt/Timeline";
import * as ganttModel from "../utils/ganttModel";

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

  test("SwitchWeek: check correct month title", async () => {
    const handleDayIndex = vi.fn();
    const screen = await render(
      <SwitchWeek
        week={ganttModel.buildWeek(new Date(2026, 0, 16))}
        handleDayIndex={handleDayIndex}
        dayIndex={0}
      />
    );
    const title = screen.getByRole("heading").element();
    await expect.element(title).toHaveTextContent("январь 2026");
  });

  test("SwitchWeek: check correct double month title", async () => {
    const handleDayIndex = vi.fn();
    const screen = await render(
      <SwitchWeek
        week={ganttModel.buildWeek(new Date(2026, 3, 27))}
        handleDayIndex={handleDayIndex}
        dayIndex={0}
      />
    );
    const title = screen.getByRole("heading").element();
    await expect.element(title).toHaveTextContent("апрель — май 2026");
  });

  test("SwitchWeek: check correct double month&year title", async () => {
    const handleDayIndex = vi.fn();
    const screen = await render(
      <SwitchWeek
        week={ganttModel.buildWeek(new Date(2026, 0, 1))}
        handleDayIndex={handleDayIndex}
        dayIndex={0}
      />
    );
    const title = screen.getByRole("heading").element();
    await expect.element(title).toHaveTextContent("декабрь 2025 — январь 2026");
  });

  test("Timeline: switch between weeks", async () => {
    const onTrackClick = vi.fn();
    const mondayFW = ganttModel.findMonday(new Date());
    const mondayPW = ganttModel.findMonday(new Date());
    const mondayNW = ganttModel.findMonday(new Date());

    mondayPW.setDate(mondayFW.getDate() - 7);
    mondayNW.setDate(mondayFW.getDate() + 7);

    const mondayFWTitle = mondayFW.toLocaleString("default", {
      day: "numeric",
      weekday: "short",
    });
    const mondayPWTitle = mondayPW.toLocaleString("default", {
      day: "numeric",
      weekday: "short",
    });
    const mondayNWTitle = mondayNW.toLocaleString("default", {
      day: "numeric",
      weekday: "short",
    });
    const screen = await render(
      <Timeline onTrackClick={onTrackClick} selectedTag={null} />
    );

    await expect.element(screen.getByText(mondayFWTitle)).toBeInTheDocument();

    await screen.getByText(">").click();
    await expect.element(screen.getByText(mondayNWTitle)).toBeInTheDocument();

    await screen.getByText("<").click();
    await expect.element(screen.getByText(mondayFWTitle)).toBeInTheDocument();

    await screen.getByText("<").click();
    await expect.element(screen.getByText(mondayPWTitle)).toBeInTheDocument();
  });
});
