"use client";

import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";

import {
  setLikeMessage,
  toggleTrackLike,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { Track } from "@/types";
import { getLikeCount, isTrackLikedByUser } from "@/utils/trackLikes";
import styles from "./likeButton.module.css";

type LikeButtonVariant = "list" | "player";

type LikeButtonProps = {
  track: Track;
  variant?: LikeButtonVariant;
  showCount?: boolean;
  className?: string;
};

export default function LikeButton({
  track,
  variant = "list",
  showCount = variant === "list",
  className,
}: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLikePending = useAppSelector((state) => state.tracks.isLikePending);

  const isLiked = useMemo(
    () => isTrackLikedByUser(track, user?._id),
    [track, user?._id],
  );

  const likeCount = useMemo(() => getLikeCount(track), [track]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      if (!user) {
        dispatch(setLikeMessage("Войдите в аккаунт, чтобы ставить лайки."));
        return;
      }

      if (isLikePending) return;

      const nextLiked = !isLiked;
      setIsAnimating(true);
      dispatch(
        toggleTrackLike({
          trackId: track._id,
          liked: nextLiked,
          userId: user._id,
        }),
      ).finally(() => {
        window.setTimeout(() => setIsAnimating(false), 350);
      });
    },
    [dispatch, isLikePending, isLiked, track._id, user],
  );

  const title = user
    ? isLiked
      ? "Убрать из избранного"
      : "Добавить в избранное"
    : "Войдите, чтобы ставить лайки";

  return (
    <div className={classNames(styles.wrap, className)}>
      <button
        type="button"
        className={classNames(styles.button, styles[variant], {
          [styles.active]: isLiked,
          [styles.pulse]: isAnimating,
        })}
        onClick={handleClick}
        disabled={isLikePending}
        aria-label={title}
        aria-pressed={isLiked}
        title={title}
      >
        <svg
          className={classNames(styles.icon, {
            [styles.iconList]: variant === "list",
            [styles.iconPlayer]: variant === "player",
          })}
        >
          <use href="/img/icon/sprite.svg#icon-like"></use>
        </svg>
        {showCount ? (
          <span className={styles.count}>{likeCount}</span>
        ) : null}
      </button>
    </div>
  );
}
