"use client";

import { useMemo, useState } from "react";
import classNames from "classnames";

import { data } from "@/mocks/tracks";
import TrackList from "@/components/trackList/trackList";
import styles from "./centralBlock.module.css";

type FilterName = "author" | "release_date" | "genre" | null;

export default function CentralBlock() {
  const [activeFilter, setActiveFilter] = useState<FilterName>(null);

  const uniqueAuthors = useMemo(
    () => Array.from(new Set(data.map((track) => track.author))),
    [],
  );
  const uniqueGenres = useMemo(
    () => Array.from(new Set(data.flatMap((track) => track.genre))),
    [],
  );
  const yearsList = useMemo(
    () => Array.from(new Set(data.map((track) => new Date(track.release_date).getFullYear()))),
    [],
  );

  const toggleFilter = (filterName: Exclude<FilterName, null>) => {
    setActiveFilter((prevFilter) => (prevFilter === filterName ? null : filterName));
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
      <h2 className={styles.centerblockH2}>Треки</h2>
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
      <TrackList tracks={data} />
    </div>
  );
}
