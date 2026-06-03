"use client";

import { useCallback, useEffect, useMemo } from "react";

import AuthGuard from "@/components/authGuard/authGuard";
import CentralBlock from "@/components/centralBlock/centralBlock";
import {
  fetchFavoriteTracks,
  setPlaylist,
} from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

function FavoritesContent() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const { favoriteTracks, isFavoritesLoading, favoritesError } = useAppSelector(
    (state) => state.tracks,
  );

  const loadFavorites = useCallback(() => {
    if (!userId) return;
    dispatch(fetchFavoriteTracks());
  }, [dispatch, userId]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const tracks = useMemo(() => favoriteTracks, [favoriteTracks]);

  useEffect(() => {
    if (tracks.length > 0) {
      dispatch(setPlaylist(tracks));
    }
  }, [dispatch, tracks]);

  return (
    <CentralBlock
      title="Мои треки"
      tracks={tracks}
      isLoading={isFavoritesLoading}
      error={favoritesError}
    />
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
