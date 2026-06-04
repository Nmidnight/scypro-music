"use client";

import classNames from "classnames";

import type { ActiveFilterPanel, SortOrder } from "@/types/filters";
import styles from "./filterBar.module.css";

type FilterBarProps = {
  activePanel: ActiveFilterPanel;
  selectedAuthor: string | null;
  selectedGenre: string | null;
  sortOrder: SortOrder;
  authors: string[];
  genres: string[];
  onTogglePanel: (panel: Exclude<ActiveFilterPanel, null>) => void;
  onSelectAuthor: (author: string) => void;
  onSelectGenre: (genre: string) => void;
  onSelectSortOrder: (order: Exclude<SortOrder, "default">) => void;
};

export default function FilterBar({
  activePanel,
  selectedAuthor,
  selectedGenre,
  sortOrder,
  authors,
  genres,
  onTogglePanel,
  onSelectAuthor,
  onSelectGenre,
  onSelectSortOrder,
}: FilterBarProps) {
  const getButtonClassName = (panel: Exclude<ActiveFilterPanel, null>) =>
    classNames(styles.button, "btn-text", {
      [styles.active]: activePanel === panel,
    });

  return (
    <div className={styles.filter}>
      <div className={styles.filterTitle}>Искать по:</div>
      <div className={styles.filterWrapper}>
        <button
          type="button"
          className={getButtonClassName("author")}
          onClick={() => onTogglePanel("author")}
        >
          исполнителю
        </button>
        {activePanel === "author" ? (
          <div className={styles.filterDropdown}>
            <div className={styles.filterList}>
              {authors.map((author) => (
                <button
                  key={author}
                  type="button"
                  className={classNames(styles.filterItem, {
                    [styles.filterItemActive]: selectedAuthor === author,
                  })}
                  onClick={() => onSelectAuthor(author)}
                >
                  {author}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.filterWrapper}>
        <button
          type="button"
          className={getButtonClassName("release_date")}
          onClick={() => onTogglePanel("release_date")}
        >
          году выпуска
        </button>
        {activePanel === "release_date" ? (
          <div className={styles.filterDropdown}>
            <div className={styles.filterList}>
              <button
                type="button"
                className={classNames(styles.filterItem, {
                  [styles.filterItemActive]: sortOrder === "older",
                })}
                onClick={() => onSelectSortOrder("older")}
              >
                Сначала старые
              </button>
              <button
                type="button"
                className={classNames(styles.filterItem, {
                  [styles.filterItemActive]: sortOrder === "newer",
                })}
                onClick={() => onSelectSortOrder("newer")}
              >
                Сначала новые
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.filterWrapper}>
        <button
          type="button"
          className={getButtonClassName("genre")}
          onClick={() => onTogglePanel("genre")}
        >
          жанру
        </button>
        {activePanel === "genre" ? (
          <div className={styles.filterDropdown}>
            <div className={styles.filterList}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={classNames(styles.filterItem, {
                    [styles.filterItemActive]: selectedGenre === genre,
                  })}
                  onClick={() => onSelectGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
