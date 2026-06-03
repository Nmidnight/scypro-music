"use client";

import { useEffect } from "react";

import {
  clearLikeMessage,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./likeToast.module.css";

export default function LikeToast() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.tracks.likeMessage);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      dispatch(clearLikeMessage());
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [dispatch, message]);

  if (!message) {
    return null;
  }

  return (
    <div className={styles.toast} role="alert">
      {message}
    </div>
  );
}
