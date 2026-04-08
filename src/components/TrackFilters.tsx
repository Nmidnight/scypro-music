import cn from "classnames";
import styles from "./TrackFilters.module.css";

export function TrackFilters() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Искать по:</div>
      <div className={cn(styles.button, "btn-text")}>исполнителю</div>
      <div className={cn(styles.button, "btn-text")}>году выпуска</div>
      <div className={cn(styles.button, "btn-text")}>жанру</div>
    </div>
  );
}
