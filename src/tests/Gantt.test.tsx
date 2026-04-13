import { describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import Gantt from "../components/Gantt/Gantt";
import { render } from "vitest-browser-react";

describe("Gantt", async () => {
  test("gantt", async () => {
    const eventHandler = vi.fn();
    render(<Gantt onTrackClick={eventHandler} selectedTag={null} />);

    await expect.element(page.getByTestId("gantt")).toBeInTheDocument();

    await expect(page.getByTestId("gantt")).toMatchScreenshot({
      timeout: 5000,
    });
  });
});
