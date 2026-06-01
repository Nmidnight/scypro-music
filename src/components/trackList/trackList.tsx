import TrackItem from "@/components/trackItem/trackItem";
import type { Track } from "@/mocks/tracks";
import styles from "./trackList.module.css";

type TrackListProps = {
  tracks: Track[];
};

export default function TrackList({ tracks }: TrackListProps) {
  return (
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
            <use href="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>
      <div className={styles.playlist}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} />
        ))}
      </div>
    </div>
  );
}
