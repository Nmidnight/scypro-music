"use client";

import classNames from "classnames";

import type { ActiveFilterPanel, SortOrder } from "@/types/filters";
import styles from "./filterBar.module.css";

type FilterBarProps = {
  activePanel: ActiveFilterPanel;
  selectedAuthors: string[];
  selectedGenres: string[];
  sortOrder: SortOrder;
  authors: string[];
  genres: string[];
  onTogglePanel: (panel: Exclude<ActiveFilterPanel, null>) => void;
  onSelectAuthor: (author: string) => void;
  onSelectGenre: (genre: string) => void;
  onSelectSortOrder: (order: Exclude<SortOrder, "default">) => void;
};

type FilterButtonProps = {
  panel: Exclude<ActiveFilterPanel, null>;
  label: string;
  count: number;
  activePanel: ActiveFilterPanel;
  onToggle: () => void;
};

function FilterButton({
  panel,
  label,
  count,
  activePanel,
  onToggle,
}: FilterButtonProps) {
  return (
    <div className={styles.buttonWrap}>
      <button
        type="button"
        className={classNames(styles.button, "btn-text", {
          [styles.active]: activePanel === panel,
          [styles.buttonWithSelection]: count > 0,
        })}
        onClick={onToggle}
      >
        {label}
      </button>
      {count > 0 ? (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </div>
  );
}

type FilterOptionsDropdownProps = {
  items: Array<{
    key: string;
    label: string;
    isActive: boolean;
    onSelect: () => void;
  }>;
};

function FilterOptionsDropdown({ items }: FilterOptionsDropdownProps) {
  return (
    <div className={styles.filterDropdown}>
      <div className={styles.filterList}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={classNames(styles.filterItem, {
              [styles.filterItemActive]: item.isActive,
            })}
            onClick={item.onSelect}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({
  activePanel,
  selectedAuthors,
  selectedGenres,
  sortOrder,
  authors,
  genres,
  onTogglePanel,
  onSelectAuthor,
  onSelectGenre,
  onSelectSortOrder,
}: FilterBarProps) {
  const sortCount = sortOrder === "default" ? 0 : 1;

  return (
    <div className={styles.filter}>
      <div className={styles.filterTitle}>Искать по:</div>
      <div className={styles.filterWrapper}>
        <FilterButton
          panel="author"
          label="исполнителю"
          count={selectedAuthors.length}
          activePanel={activePanel}
          onToggle={() => onTogglePanel("author")}
        />
        {activePanel === "author" ? (
          <FilterOptionsDropdown
            items={authors.map((author) => ({
              key: author,
              label: author,
              isActive: selectedAuthors.includes(author),
              onSelect: () => onSelectAuthor(author),
            }))}
          />
        ) : null}
      </div>
      <div className={styles.filterWrapper}>
        <FilterButton
          panel="release_date"
          label="году выпуска"
          count={sortCount}
          activePanel={activePanel}
          onToggle={() => onTogglePanel("release_date")}
        />
        {activePanel === "release_date" ? (
          <FilterOptionsDropdown
            items={[
              {
                key: "older",
                label: "Сначала старые",
                isActive: sortOrder === "older",
                onSelect: () => onSelectSortOrder("older"),
              },
              {
                key: "newer",
                label: "Сначала новые",
                isActive: sortOrder === "newer",
                onSelect: () => onSelectSortOrder("newer"),
              },
            ]}
          />
        ) : null}
      </div>
      <div className={styles.filterWrapper}>
        <FilterButton
          panel="genre"
          label="жанру"
          count={selectedGenres.length}
          activePanel={activePanel}
          onToggle={() => onTogglePanel("genre")}
        />
        {activePanel === "genre" ? (
          <FilterOptionsDropdown
            items={genres.map((genre) => ({
              key: genre,
              label: genre,
              isActive: selectedGenres.includes(genre),
              onSelect: () => onSelectGenre(genre),
            }))}
          />
        ) : null}
      </div>
    </div>
  );
}
