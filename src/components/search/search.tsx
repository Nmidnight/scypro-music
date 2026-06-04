"use client";

import styles from "./search.module.css";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className={styles.search}>
      <svg className={styles.searchSvg}>
        <use href="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.searchText}
        type="search"
        placeholder="Поиск"
        name="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
