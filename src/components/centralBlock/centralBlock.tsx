"use client";

import { useMemo, useState } from "react";
import classNames from "classnames";

import TrackList from "@/components/trackList/trackList";
import type { Track } from "@/types";
import styles from "./centralBlock.module.css";

type FilterName = "author" | "release_date" | "genre" | null;

type CentralBlockProps = {
  title: string;
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
};

export default function CentralBlock({
  title,
  tracks,
  isLoading,
  error,
}: CentralBlockProps) {
  const [activeFilter, setActiveFilter] = useState<FilterName>(null);

  const uniqueAuthors = useMemo(
    () => Array.from(new Set(tracks.map((track) => track.author))),
    [tracks],
  );
  const uniqueGenres = useMemo(
    () => Array.from(new Set(tracks.flatMap((track) => track.genre))),
    [tracks],
  );
  const yearsList = useMemo(
    () =>
      Array.from(
        new Set(
          tracks.map((track) => new Date(track.release_date).getFullYear()),
        ),
      ),
    [tracks],
  );

  const toggleFilter = (filterName: Exclude<FilterName, null>) => {
    setActiveFilter((prevFilter) =>
      prevFilter === filterName ? null : filterName,
    );
  };

  const getButtonClassName = (nameFilter: Exclude<FilterName, null>) =>
    classNames(styles.button, "btn-text", {
      [styles.active]: activeFilter === nameFilter,
    });

  return (
    <div className={styles.centerblock}>
      <div className={styles.search}>
        <svg className={styles.searchSvg}>
          <use href="/img/icon/sprite.svg#icon-search"></use>
        </svg>
        <input
          className={styles.searchText}
          type="search"
          placeholder="Поиск"
          name="search"
        />
      </div>
      <h2 className={styles.centerblockH2}>{title}</h2>
      <div className={styles.filter}>
        <div className={styles.filterTitle}>Искать по:</div>
        <div className={styles.filterWrapper}>
          <button
            type="button"
            className={getButtonClassName("author")}
            onClick={() => toggleFilter("author")}
          >
            исполнителю
          </button>
          {activeFilter === "author" ? (
            <div className={styles.filterDropdown}>
              <div className={styles.filterList}>
                {uniqueAuthors.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.filterWrapper}>
          <button
            type="button"
            className={getButtonClassName("release_date")}
            onClick={() => toggleFilter("release_date")}
          >
            году выпуска
          </button>
          {activeFilter === "release_date" ? (
            <div className={styles.filterDropdown}>
              <div className={styles.filterList}>
                {yearsList.map((year) => (
                  <span key={year}>{year}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.filterWrapper}>
          <button
            type="button"
            className={getButtonClassName("genre")}
            onClick={() => toggleFilter("genre")}
          >
            жанру
          </button>
          {activeFilter === "genre" ? (
            <div className={styles.filterDropdown}>
              <div className={styles.filterList}>
                {uniqueGenres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <p className={styles.stateMessage}>Загрузка треков…</p>
      ) : error ? (
        <p className={classNames(styles.stateMessage, styles.stateError)}>
          {error}
        </p>
      ) : tracks.length === 0 ? (
        <p className={styles.stateMessage}>Треки не найдены.</p>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
}
