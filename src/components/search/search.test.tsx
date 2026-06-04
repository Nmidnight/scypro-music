import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Search from "./search";

describe("Search", () => {
  it("renders search input with placeholder", () => {
    render(<Search value="" onChange={() => undefined} />);
    expect(screen.getByPlaceholderText("Поиск")).toBeInTheDocument();
  });

  it("shows current value", () => {
    render(<Search value="Elek" onChange={() => undefined} />);
    expect(screen.getByDisplayValue("Elek")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Search value="" onChange={handleChange} />);
    await user.type(screen.getByPlaceholderText("Поиск"), "tro");

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange.mock.calls.map(([value]) => value).join("")).toBe("tro");
  });
});
