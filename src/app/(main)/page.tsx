"use client";

import { useEffect } from "react";

import CentralBlock from "@/components/centralBlock/centralBlock";
import { getTracks, setPlaylist } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { allTracks, isLoading, error } = useAppSelector(
    (state) => state.tracks,
  );

  useEffect(() => {
    dispatch(getTracks());
  }, [dispatch]);

  useEffect(() => {
    if (allTracks.length > 0) {
      dispatch(setPlaylist(allTracks));
    }
  }, [allTracks, dispatch]);

  return (
    <CentralBlock
      title="Треки"
      tracks={allTracks}
      isLoading={isLoading}
      error={error}
    />
  );
}
