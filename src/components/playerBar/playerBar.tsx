"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  setIsPlaying,
  togglePlayback,
  trackPlaybackEnded,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./playerBar.module.css";

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }

    audio.src = currentTrack.track_file;
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          dispatch(setIsPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Number(event.target.value);
  };

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        className={styles.hiddenAudio}
        aria-hidden
        onEnded={() => dispatch(trackPlaybackEnded())}
      />
      <div className={styles.content}>
        <div className={styles.playerProgress} />
        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.btnPrev}>
                <svg className={styles.btnPrevSvg}>
                  <use href="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <button
                type="button"
                className={`${styles.btnPlay} btn`}
                disabled={!currentTrack}
                aria-label={isPlaying ? "Пауза" : "Воспроизведение"}
                onClick={() => dispatch(togglePlayback())}
              >
                <svg className={styles.btnPlaySvg}>
                  <use
                    href={
                      isPlaying
                        ? "/img/icon/sprite.svg#icon-pause"
                        : "/img/icon/sprite.svg#icon-play"
                    }
                  ></use>
                </svg>
              </button>
              <div className={styles.btnNext}>
                <svg className={styles.btnNextSvg}>
                  <use href="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div className={`${styles.btnRepeat} ${styles.iconButton}`}>
                <svg className={styles.btnRepeatSvg}>
                  <use href="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div className={`${styles.btnShuffle} ${styles.iconButton}`}>
                <svg className={styles.btnShuffleSvg}>
                  <use href="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.trackContain}>
                <div className={styles.trackImage}>
                  <svg className={styles.trackSvg}>
                    <use href="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackAuthor}>
                  <Link className={styles.trackAuthorLink} href="#">
                    {currentTrack?.name ?? "Выберите трек"}
                  </Link>
                </div>
                <div className={styles.trackAlbum}>
                  <Link className={styles.trackAlbumLink} href="#">
                    {currentTrack
                      ? `${currentTrack.author} — ${currentTrack.album}`
                      : ""}
                  </Link>
                </div>
              </div>

              <div className={styles.trackActions}>
                <div className={styles.iconButton}>
                  <svg className={styles.likeSvg}>
                    <use href="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div className={`${styles.iconButton} ${styles.dislikeSpaced}`}>
                  <svg className={styles.dislikeSvg}>
                    <use href="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use href="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={`${styles.volumeProgress} btn`}>
                <input
                  className={`${styles.volumeProgressLine} btn`}
                  type="range"
                  name="range"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={1}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
