import Link from "next/link";
import styles from "./TrackRow.module.css";

export type PlaylistTrack = {
  id: string;
  title: string;
  titleSpan?: string;
  author: string;
  album: string;
  duration: string;
};

type TrackRowProps = {
  track: PlaylistTrack;
};

export function TrackRow({ track }: TrackRowProps) {
  const { title, titleSpan, author, album, duration } = track;

  return (
    <div className={styles.item}>
      <div className={styles.track}>
        <div className={styles.title}>
          <div className={styles.titleImage}>
            <svg className={styles.titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div>
            <Link className={styles.titleLink} href="">
              {title}{" "}
              <span className={styles.titleSpan}>{titleSpan ?? ""}</span>
            </Link>
          </div>
        </div>
        <div className={styles.author}>
          <Link className={styles.authorLink} href="">
            {author}
          </Link>
        </div>
        <div className={styles.album}>
          <Link className={styles.albumLink} href="">
            {album}
          </Link>
        </div>
        <div className={styles.time}>
          <svg className={styles.timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.timeText}>{duration}</span>
        </div>
      </div>
    </div>
  );
}
