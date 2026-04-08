import styles from "./SearchBar.module.css";

export function SearchBar() {
  return (
    <div className={styles.root}>
      <svg className={styles.icon}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.input}
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
  );
}
