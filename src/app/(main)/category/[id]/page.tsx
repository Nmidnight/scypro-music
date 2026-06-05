"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { getSelectionById } from "@/api/selectionsApi";
import CentralBlock from "@/components/centralBlock/centralBlock";
import { useSyncPlaylist } from "@/hooks/useSyncPlaylist";
import { getTracks } from "@/store/features/trackSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { Selection } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const dispatch = useAppDispatch();
  const {
    allTracks,
    isLoading: tracksLoading,
    error: tracksError,
  } = useAppSelector((state) => state.tracks);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [selectionLoading, setSelectionLoading] = useState(true);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getTracks());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadSelection = async () => {
      setSelectionLoading(true);
      setSelectionError(null);
      try {
        const data = await getSelectionById(id);
        if (active) setSelection(data);
      } catch (error: unknown) {
        if (active) {
          setSelectionError(
            getErrorMessage(error, "Не удалось загрузить подборку."),
          );
        }
      } finally {
        if (active) setSelectionLoading(false);
      }
    };

    loadSelection();

    return () => {
      active = false;
    };
  }, [id]);

  const selectionTracks = useMemo(() => {
    if (!selection) return [];
    return selection.items
      .map((trackId) => allTracks.find((track) => track._id === trackId))
      .filter((track): track is NonNullable<typeof track> => Boolean(track));
  }, [selection, allTracks]);

  useSyncPlaylist(selectionTracks);

  return (
    <CentralBlock
      title={selection?.name ?? "Подборка"}
      tracks={selectionTracks}
      isLoading={tracksLoading || selectionLoading}
      error={tracksError ?? selectionError}
    />
  );
}
