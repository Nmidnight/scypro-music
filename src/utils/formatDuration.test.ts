import { describe, expect, it } from "vitest";

import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
  it("formats seconds as m:ss", () => {
    expect(formatDuration(125)).toBe("2:05");
    expect(formatDuration(0)).toBe("0:00");
  });

  it("handles invalid values", () => {
    expect(formatDuration(-1)).toBe("0:00");
    expect(formatDuration(Number.NaN)).toBe("0:00");
  });
});
