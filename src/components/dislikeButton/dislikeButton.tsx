"use client";

import classNames from "classnames";
import { useCallback } from "react";

import { LOGIN_REQUIRED_DISLIKE } from "@/constants/messages";
import { showToast } from "@/store/features/toastSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./dislikeButton.module.css";

type DislikeButtonProps = {
  className?: string;
  disabled?: boolean;
};

export default function DislikeButton({
  className,
  disabled = false,
}: DislikeButtonProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleClick = useCallback(() => {
    if (!user) {
      dispatch(showToast({ message: LOGIN_REQUIRED_DISLIKE, type: "warning" }));
    }
  }, [dispatch, user]);

  return (
    <button
      type="button"
      className={classNames(styles.button, className, {
        [styles.disabled]: !user || disabled,
      })}
      disabled={disabled}
      onClick={handleClick}
      aria-label={
        user ? "Дизлайк" : "Войдите, чтобы ставить дизлайки"
      }
      title={user ? "Дизлайк" : "Войдите, чтобы ставить дизлайки"}
    >
      <svg className={styles.icon}>
        <use href="/img/icon/sprite.svg#icon-dislike"></use>
      </svg>
    </button>
  );
}
