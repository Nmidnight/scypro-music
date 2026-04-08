import { Playlist } from "./Playlist";
import { SearchBar } from "./SearchBar";
import { TrackFilters } from "./TrackFilters";
import styles from "./CenterBlock.module.css";

export function CenterBlock() {
  return (
    <div className={styles.root}>
      <SearchBar />
      <h2 className={styles.title}>Треки</h2>
      <TrackFilters />
      <Playlist />
    </div>
  );
}
