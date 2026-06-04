import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FilterBar from "./filterBar";

const defaultProps = {
  activePanel: null as const,
  selectedAuthor: null,
  selectedGenre: null,
  sortOrder: "default" as const,
  authors: ["Alice", "Bob"],
  genres: ["Pop", "Rock"],
  onTogglePanel: vi.fn(),
  onSelectAuthor: vi.fn(),
  onSelectGenre: vi.fn(),
  onSelectSortOrder: vi.fn(),
};

describe("FilterBar", () => {
  it("renders filter buttons", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole("button", { name: "исполнителю" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "году выпуска" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "жанру" })).toBeInTheDocument();
  });

  it("opens author list and selects author", async () => {
    const user = userEvent.setup();
    const onSelectAuthor = vi.fn();

    render(
      <FilterBar
        {...defaultProps}
        activePanel="author"
        onSelectAuthor={onSelectAuthor}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alice" }));
    expect(onSelectAuthor).toHaveBeenCalledWith("Alice");
  });

  it("opens sort options and selects newer", async () => {
    const user = userEvent.setup();
    const onSelectSortOrder = vi.fn();

    render(
      <FilterBar
        {...defaultProps}
        activePanel="release_date"
        onSelectSortOrder={onSelectSortOrder}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Сначала новые" }));
    expect(onSelectSortOrder).toHaveBeenCalledWith("newer");
  });

  it("toggles filter panel", async () => {
    const user = userEvent.setup();
    const onTogglePanel = vi.fn();

    render(<FilterBar {...defaultProps} onTogglePanel={onTogglePanel} />);
    await user.click(screen.getByRole("button", { name: "жанру" }));
    expect(onTogglePanel).toHaveBeenCalledWith("genre");
  });
});
