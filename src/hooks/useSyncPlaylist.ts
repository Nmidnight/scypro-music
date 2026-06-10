import { useEffect } from "react";

import { setPlaylist } from "@/store/features/trackSlice";
import { useAppDispatch } from "@/store/store";
import type { Track } from "@/types";

export function useSyncPlaylist(tracks: Track[]): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPlaylist(tracks));
  }, [dispatch, tracks]);
}
