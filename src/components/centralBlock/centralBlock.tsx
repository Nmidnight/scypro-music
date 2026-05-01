"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import classNames from "classnames";

import { data } from "@/mocks/tracks";
import styles from "./centralBlock.module.css";

type FilterName = "author" | "release_date" | "genre" | null;

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

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
          <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
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
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <div className={`${styles.playlistTitleCol} ${styles.col01}`}>
            Трек
          </div>
          <div className={`${styles.playlistTitleCol} ${styles.col02}`}>
            Исполнитель
          </div>
          <div className={`${styles.playlistTitleCol} ${styles.col03}`}>
            Альбом
          </div>
          <div className={`${styles.playlistTitleCol} ${styles.col04}`}>
            <svg className={styles.playlistTitleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.playlist}>
          {data.map((track) => (
            <div key={track._id} className={styles.playlistItem}>
              <div className={styles.playlistTrack}>
                <div className={styles.trackTitle}>
                  <div className={styles.trackTitleImage}>
                    <svg className={styles.trackTitleSvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                    </svg>
                  </div>
                  <div className={styles.trackTitleText}>
                    <Link className={styles.trackTitleLink} href="#">
                      {track.name}
                    </Link>
                  </div>
                </div>
                <div className={styles.trackAuthor}>
                  <Link className={styles.trackAuthorLink} href="#">
                    {track.author}
                  </Link>
                </div>
                <div className={styles.trackAlbum}>
                  <Link className={styles.trackAlbumLink} href="#">
                    {track.album}
                  </Link>
                </div>
                <div className={styles.trackTime}>
                  <svg className={styles.trackTimeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                  <span className={styles.trackTimeText}>
                    {formatDuration(track.duration_in_seconds)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
