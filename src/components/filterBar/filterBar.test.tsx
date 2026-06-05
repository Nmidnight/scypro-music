import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FilterBar from "./filterBar";

const defaultProps = {
  activePanel: null as const,
  selectedAuthors: [],
  selectedGenres: [],
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

  it("shows selection count badge on filter buttons", () => {
    const { container } = render(
      <FilterBar
        {...defaultProps}
        selectedAuthors={["Alice", "Bob"]}
        selectedGenres={["Rock", "Pop"]}
        sortOrder="newer"
      />,
    );

    const badges = container.querySelectorAll('[aria-hidden="true"]');
    expect(badges).toHaveLength(3);
    expect(badges[0]).toHaveTextContent("2");
    expect(badges[1]).toHaveTextContent("1");
    expect(badges[2]).toHaveTextContent("2");
  });

  it("hides selection count badge when nothing is selected", () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
