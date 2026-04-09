import { describe, expect, test, vi } from "vitest";
import * as convertDate from "../utils/convertDate";
import { makeTagged } from "../utils/tasksFormatting";
import { testMakeTagged, testTasksTags, testWeekGanttTracks } from "./testData";
import buildWeekGanttTracks, {
  _buildWeekSegment,
  buildWeek,
  findMonday,
} from "../utils/ganttModel";

describe("convertDate", () => {
  test("convert YMD string to DateMs", () => {
    expect(convertDate.YMDToDateMs("2026-04-08")).toBe(
      new Date(2026, 3, 8).getTime()
    );
    expect(() => convertDate.YMDToDateMs("2026.04.08")).toThrow(
      new convertDate.DateError("Date format does not matches Y-M-D")
    );
  });

  test("convert Date to YMD string", () => {
    expect(convertDate.dateToYMD(new Date(2026, 3, 8, 0, 0))).toBe(
      "2026-04-08"
    );
  });
});

describe("tasksFormatting", () => {
  test("makeTagged: {TaskID: tasks data} from object of tags & tasks", () => {
    expect(makeTagged(testTasksTags.tasks, testTasksTags.tags)).toEqual(
      testMakeTagged
    );
  });
});

describe("ganttModel", () => {
  test("findMonday: returns same date if input is monday", () => {
    const date = new Date(2026, 3, 6);
    expect(findMonday(date).getTime()).toBe(date.getTime());
  });

  test("findMonday: returns monday for midweek date", () => {
    expect(findMonday(new Date(2026, 3, 8)).getTime()).toBe(
      new Date(2026, 3, 6).getTime()
    );
  });

  test("findMonday: returns monday for sunday", () => {
    expect(findMonday(new Date(2026, 3, 12)).getTime()).toBe(
      new Date(2026, 3, 6).getTime()
    );
  });

  test("build week", () => {
    const week = buildWeek(new Date(2026, 3, 8));
    expect(week).toHaveLength(7);
    for (let i = 1; i < 7; i++) {
      expect(week[i]!.getDate()).toBe(week[i - 1]!.getDate() + 1);
    }
  });

  test("buildWeekGanttTracks: throws if week is not 7 days", () => {
    expect(() => buildWeekGanttTracks({}, [new Date()] as any, null)).toThrow(
      "Gantt: wrong week range"
    );
  });

  const tagged = makeTagged(testTasksTags.tasks, testTasksTags.tags).tagged;
  const week = buildWeek(new Date(2026, 3, 6, 0, 0));

  test("buildWeekGanttTracks: applies opacity based on selected tag", () => {
    const tracks = buildWeekGanttTracks(tagged, week, 0);

    expect(tracks.find((t) => t.tagId === 0)?.opacity).toBe("100%");
    expect(tracks.find((t) => t.tagId !== 0)?.opacity).toBe("30%");
  });

  test("buildWeekGanttTracks: build gantt tracks for given week", () => {
    expect(buildWeekGanttTracks(tagged, week, null)).toEqual(
      testWeekGanttTracks
    );
  });

  test("buildWeekGanttTracks: build gantt tracks for given week (snapshot)", () => {
    const tagged = makeTagged(testTasksTags.tasks, testTasksTags.tags).tagged;
    const week = buildWeek(new Date(2026, 3, 6));
    const result = buildWeekGanttTracks(tagged, week, null);

    expect(result).toMatchSnapshot();
  });

  test("_buildWeekSegment: use YMDToDateMs to parse date", () => {
    const spy = vi.spyOn(convertDate, "YMDToDateMs");

    _buildWeekSegment(week, tagged[0]!);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
