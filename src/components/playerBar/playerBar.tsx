"use client";

import Link from "next/link";
import classNames from "classnames";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import DislikeButton from "@/components/dislikeButton/dislikeButton";
import LikeButton from "@/components/likeButton/likeButton";
import {
  nextTrack,
  playNextAfterEnd,
  prevTrack,
  selectCanGoNext,
  selectCanGoPrev,
  selectCurrentTrack,
  setIsPlaying,
  togglePlayback,
  toggleRepeat,
  toggleShuffle,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatDuration } from "@/utils/formatDuration";
import styles from "./playerBar.module.css";

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const isRepeat = useAppSelector((state) => state.tracks.isRepeat);
  const canGoNext = useAppSelector(selectCanGoNext);
  const canGoPrev = useAppSelector(selectCanGoPrev);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute("src");
      requestAnimationFrame(() => {
        setCurrentTime(0);
        setDuration(0);
      });
      return;
    }

    audio.src = currentTrack.track_file;
    requestAnimationFrame(() => {
      setCurrentTime(0);
      setDuration(0);
    });
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = Boolean(isRepeat && currentTrack);
  }, [isRepeat, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      const d = audio.duration;
      setDuration(Number.isFinite(d) ? d : 0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
    };
  }, [currentTrack?._id]);

  const trackDuration =
    Number.isFinite(duration) && duration > 0
      ? duration
      : (currentTrack?.duration_in_seconds ?? 0);

  const progressRatio =
    trackDuration > 0 ? Math.min(1, Math.max(0, currentTime / trackDuration)) : 0;

  const handleProgressPointer = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !trackDuration || trackDuration <= 0) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      audio.currentTime = ratio * trackDuration;
      setCurrentTime(ratio * trackDuration);
    },
    [trackDuration],
  );

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleProgressPointer(event.clientX);
  };

  const handleProgressKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const audio = audioRef.current;
    if (!audio || !trackDuration) return;
    const delta = trackDuration * 0.05 * (event.key === "ArrowRight" ? 1 : -1);
    const next = Math.min(trackDuration, Math.max(0, audio.currentTime + delta));
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setVolume(next);
  };

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        className={styles.hiddenAudio}
        aria-hidden
        preload="metadata"
        onEnded={() => {
          dispatch(playNextAfterEnd());
        }}
      />
      <div className={styles.progressSection}>
        <div className={styles.progressTimes}>
          <span className={styles.timeText}>{formatDuration(currentTime)}</span>
          <span className={styles.timeText}>{formatDuration(trackDuration)}</span>
        </div>
        <div
          ref={progressRef}
          className={styles.playerProgress}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={Math.max(1, Math.round(trackDuration))}
          aria-valuenow={Math.round(currentTime)}
          aria-label="Прогресс воспроизведения"
          onClick={handleProgressClick}
          onKeyDown={handleProgressKeyDown}
        >
          <div
            className={styles.playerProgressFill}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>
      <div className={styles.playerBlock}>
        <div className={styles.player}>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.btnPrev}
                disabled={!canGoPrev}
                aria-label="Предыдущий трек"
                onClick={() => dispatch(prevTrack())}
              >
                <svg className={styles.btnPrevSvg}>
                  <use href="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </button>
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
              <button
                type="button"
                className={styles.btnNext}
                disabled={!canGoNext}
                aria-label="Следующий трек"
                onClick={() => dispatch(nextTrack())}
              >
                <svg className={styles.btnNextSvg}>
                  <use href="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.btnRepeat, styles.iconButton, {
                  [styles.modeActive]: isRepeat,
                })}
                aria-label={isRepeat ? "Выключить повтор" : "Повтор трека"}
                aria-pressed={isRepeat}
                onClick={() => dispatch(toggleRepeat())}
              >
                <svg className={styles.btnRepeatSvg}>
                  <use href="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.btnShuffle, styles.iconButton, {
                  [styles.modeActive]: isShuffle,
                })}
                aria-label={isShuffle ? "Выключить перемешивание" : "Перемешать"}
                aria-pressed={isShuffle}
                onClick={() => dispatch(toggleShuffle())}
              >
                <svg className={styles.btnShuffleSvg}>
                  <use href="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </button>
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
                    {currentTrack?.author ?? ""}
                  </Link>
                </div>
              </div>

              <div className={styles.trackActions}>
                {currentTrack ? (
                  <LikeButton
                    track={currentTrack}
                    variant="player"
                    showCount={false}
                  />
                ) : null}
                <DislikeButton
                  className={classNames(styles.iconButton, styles.dislikeSpaced)}
                  disabled={!currentTrack}
                />
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
                name="volume"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
