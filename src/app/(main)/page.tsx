"use client";

import { useEffect } from "react";

import CentralBlock from "@/components/centralBlock/centralBlock";
import { useSyncPlaylist } from "@/hooks/useSyncPlaylist";
import { getTracks } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const { allTracks, isLoading, error } = useAppSelector(
    (state) => state.tracks,
  );

  useEffect(() => {
    dispatch(getTracks());
  }, [dispatch, userId]);

  useSyncPlaylist(allTracks);

  return (
    <CentralBlock
      title="Треки"
      tracks={allTracks}
      isLoading={isLoading}
      error={error}
    />
  );
}
