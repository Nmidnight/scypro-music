"use client";

import { useEffect } from "react";
import classNames from "classnames";

import { clearToast } from "@/store/features/toastSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./toast.module.css";

const TOAST_DURATION_MS = 4000;

export default function Toast() {
  const dispatch = useAppDispatch();
  const { message, type } = useAppSelector((state) => state.toast);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      dispatch(clearToast());
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [dispatch, message]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={classNames(styles.toast, styles[type])}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
