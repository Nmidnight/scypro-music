import cn from "classnames";
import { TrackRow, type PlaylistTrack } from "./TrackRow";
import styles from "./Playlist.module.css";

const TRACKS: PlaylistTrack[] = [
  {
    id: "1",
    title: "Guilt",
    titleSpan: "",
    author: "Nero",
    album: "Welcome Reality",
    duration: "4:44",
  },
  {
    id: "2",
    title: "Elektro",
    titleSpan: "",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
  },
  {
    id: "3",
    title: "I’m Fire",
    titleSpan: "",
    author: "Ali Bakgor",
    album: "I’m Fire",
    duration: "2:22",
  },
  {
    id: "4",
    title: "Non Stop",
    titleSpan: "(Remix)",
    author: "Стоункат, Psychopath",
    album: "Non Stop",
    duration: "4:12",
  },
  {
    id: "5",
    title: "Run Run",
    titleSpan: "(feat. AR/CO)",
    author: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    duration: "2:54",
  },
];

export function Playlist() {
  return (
    <div className={styles.root}>
      <div className={styles.headRow}>
        <div className={cn(styles.playlistTitleCol, styles.col01)}>Трек</div>
        <div className={cn(styles.playlistTitleCol, styles.col02)}>
          Исполнитель
        </div>
        <div className={cn(styles.playlistTitleCol, styles.col03)}>Альбом</div>
        <div className={cn(styles.playlistTitleCol, styles.col04)}>
          <svg className={styles.playlistTitleSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>
      <div className={styles.list}>
        {TRACKS.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
