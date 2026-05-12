"use client";

import classNames from "classnames";

import type { Track } from "@/mocks/tracks";
import {
  selectCurrentTrack,
  setCurrentTrack,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./trackItem.module.css";

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type TrackItemProps = {
  track: Track;
};

export default function TrackItem({ track }: TrackItemProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);

  const isCurrent = currentTrack?._id === track._id;

  return (
    <div className={styles.playlistItem}>
      <div
        className={styles.playlistTrack}
        role="button"
        tabIndex={0}
        aria-current={isCurrent ? "true" : undefined}
        onClick={() => dispatch(setCurrentTrack(track))}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            dispatch(setCurrentTrack(track));
          }
        }}
      >
        <div className={styles.trackTitle}>
          <span className={styles.dotWrap} aria-hidden>
            <span
              className={classNames(styles.dot, {
                [styles.dotVisible]: isCurrent,
                [styles.dotPulse]: isCurrent && isPlaying,
              })}
            />
          </span>
          <div className={styles.trackTitleImage}>
            <svg className={styles.trackTitleSvg}>
              <use href="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div className={styles.trackTitleText}>
            <span className={styles.trackTitleLink}>{track.name}</span>
          </div>
        </div>
        <div className={styles.trackAuthor}>
          <span className={styles.trackAuthorLink}>{track.author}</span>
        </div>
        <div className={styles.trackAlbum}>
          <span className={styles.trackAlbumLink}>{track.album}</span>
        </div>
        <div className={styles.trackTime}>
          <svg className={styles.trackTimeSvg}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.trackTimeText}>
            {formatDuration(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
