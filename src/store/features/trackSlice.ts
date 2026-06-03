import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createAuthContext } from "@/api/authContext";
import { logout } from "@/store/features/authSlice";
import {
  addTrackToFavorites,
  getAllTracks,
  getFavoriteTracks,
  removeTrackFromFavorites,
} from "@/api/tracksApi";
import type { AppDispatch, RootState } from "@/store/store";
import type { Track } from "@/types";
import { applyLikeToTrack } from "@/utils/trackLikes";

export type TrackSliceState = {
  allTracks: Track[];
  orderedPlaylist: Track[];
  initialPlaylist: Track[];
  favoriteTracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isLoading: boolean;
  isFavoritesLoading: boolean;
  isLikePending: boolean;
  error: string | null;
  favoritesError: string | null;
  likeMessage: string | null;
};

type ToggleLikeArg = {
  trackId: number;
  liked: boolean;
  userId: number;
};

function shuffleCopy<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function patchTrackInList(tracks: Track[], trackId: number, patch: Track): Track[] {
  const index = tracks.findIndex((track) => track._id === trackId);
  if (index === -1) return tracks;
  const next = [...tracks];
  next[index] = patch;
  return next;
}

function findTrackById(state: TrackSliceState, trackId: number): Track | undefined {
  return (
    state.allTracks.find((track) => track._id === trackId) ??
    state.orderedPlaylist.find((track) => track._id === trackId) ??
    state.favoriteTracks.find((track) => track._id === trackId)
  );
}

function patchTrackEverywhere(
  state: TrackSliceState,
  trackId: number,
  patch: Track,
): void {
  state.allTracks = patchTrackInList(state.allTracks, trackId, patch);
  state.initialPlaylist = patchTrackInList(
    state.initialPlaylist,
    trackId,
    patch,
  );
  state.orderedPlaylist = patchTrackInList(
    state.orderedPlaylist,
    trackId,
    patch,
  );
  state.favoriteTracks = patchTrackInList(
    state.favoriteTracks,
    trackId,
    patch,
  );
}

function syncFavoriteList(
  state: TrackSliceState,
  trackId: number,
  patch: Track,
  liked: boolean,
): void {
  if (liked) {
    if (!state.favoriteTracks.some((track) => track._id === trackId)) {
      state.favoriteTracks = [...state.favoriteTracks, patch];
    }
    return;
  }

  state.favoriteTracks = state.favoriteTracks.filter(
    (track) => track._id !== trackId,
  );
}

const initialState: TrackSliceState = {
  allTracks: [],
  orderedPlaylist: [],
  initialPlaylist: [],
  favoriteTracks: [],
  currentIndex: -1,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  isLoading: false,
  isFavoritesLoading: false,
  isLikePending: false,
  error: null,
  favoritesError: null,
  likeMessage: null,
};

type TracksRoot = { tracks: TrackSliceState };

export const selectCurrentTrack = (state: TracksRoot): Track | null => {
  const { orderedPlaylist, currentIndex } = state.tracks;
  if (currentIndex < 0 || currentIndex >= orderedPlaylist.length) return null;
  return orderedPlaylist[currentIndex] ?? null;
};

export const selectCanGoNext = (state: TracksRoot): boolean => {
  const { orderedPlaylist, currentIndex } = state.tracks;
  return currentIndex >= 0 && currentIndex < orderedPlaylist.length - 1;
};

export const selectCanGoPrev = (state: TracksRoot): boolean => {
  const { currentIndex } = state.tracks;
  return currentIndex > 0;
};

export const getTracks = createAsyncThunk<Track[], void, { rejectValue: string }>(
  "tracks/getTracks",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllTracks();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки треков",
      );
    }
  },
);

export const fetchFavoriteTracks = createAsyncThunk<
  Track[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("tracks/fetchFavoriteTracks", async (_, { getState, dispatch, rejectWithValue }) => {
  const user = getState().auth.user;
  if (!user) {
    return rejectWithValue("Войдите в аккаунт, чтобы открыть избранное.");
  }

  try {
    const ctx = createAuthContext(getState, dispatch);
    return await getFavoriteTracks(ctx);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Не удалось загрузить избранное.",
    );
  }
});

export const toggleTrackLike = createAsyncThunk<
  ToggleLikeArg,
  ToggleLikeArg,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "tracks/toggleTrackLike",
  async ({ trackId, liked }, { getState, dispatch, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user) {
      return rejectWithValue("Войдите в аккаунт, чтобы ставить лайки.");
    }

    try {
      const ctx = createAuthContext(getState, dispatch);
      if (liked) {
        await addTrackToFavorites(ctx, trackId);
      } else {
        await removeTrackFromFavorites(ctx, trackId);
      }
      return { trackId, liked, userId: user._id };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Не удалось обновить лайк.",
      );
    }
  },
);

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      const currentId =
        state.currentIndex >= 0
          ? state.orderedPlaylist[state.currentIndex]?._id
          : null;

      state.initialPlaylist = action.payload;
      state.orderedPlaylist = state.isShuffle
        ? shuffleCopy(action.payload)
        : action.payload;

      state.currentIndex =
        currentId != null
          ? state.orderedPlaylist.findIndex((t) => t._id === currentId)
          : -1;
    },
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      const idx = state.orderedPlaylist.findIndex(
        (t) => t._id === action.payload._id,
      );
      if (idx !== -1) {
        state.currentIndex = idx;
        state.isPlaying = true;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    togglePlayback: (state) => {
      if (state.currentIndex >= 0) {
        state.isPlaying = !state.isPlaying;
      }
    },
    nextTrack: (state) => {
      if (
        state.currentIndex < 0 ||
        state.currentIndex >= state.orderedPlaylist.length - 1
      ) {
        return;
      }
      state.currentIndex += 1;
      state.isPlaying = true;
    },
    prevTrack: (state) => {
      if (state.currentIndex <= 0) {
        return;
      }
      state.currentIndex -= 1;
      state.isPlaying = true;
    },
    playNextAfterEnd: (state) => {
      if (state.currentIndex < 0) return;
      if (state.currentIndex < state.orderedPlaylist.length - 1) {
        state.currentIndex += 1;
        state.isPlaying = true;
      } else {
        state.isPlaying = false;
      }
    },
    toggleShuffle: (state) => {
      const prevId =
        state.currentIndex >= 0
          ? state.orderedPlaylist[state.currentIndex]._id
          : null;
      state.isShuffle = !state.isShuffle;
      state.orderedPlaylist = state.isShuffle
        ? shuffleCopy(state.initialPlaylist)
        : [...state.initialPlaylist];
      if (prevId != null) {
        state.currentIndex = state.orderedPlaylist.findIndex(
          (t) => t._id === prevId,
        );
      }
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
    clearLikeMessage: (state) => {
      state.likeMessage = null;
    },
    setLikeMessage: (state, action: PayloadAction<string>) => {
      if (state.likeMessage === action.payload) return;
      state.likeMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTracks = action.payload;
      })
      .addCase(getTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка загрузки треков";
      })
      .addCase(fetchFavoriteTracks.pending, (state) => {
        state.isFavoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchFavoriteTracks.fulfilled, (state, action) => {
        state.isFavoritesLoading = false;
        state.favoriteTracks = action.payload;
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.isFavoritesLoading = false;
        state.favoritesError =
          action.payload ?? "Не удалось загрузить избранное.";
      })
      .addCase(toggleTrackLike.pending, (state, action) => {
        state.isLikePending = true;
        state.likeMessage = null;

        const { trackId, liked, userId } = action.meta.arg;
        const track = findTrackById(state, trackId);
        if (!track) return;

        const patched = applyLikeToTrack(track, userId, liked);
        patchTrackEverywhere(state, trackId, patched);
        syncFavoriteList(state, trackId, patched, liked);
      })
      .addCase(toggleTrackLike.fulfilled, (state) => {
        state.isLikePending = false;
      })
      .addCase(toggleTrackLike.rejected, (state, action) => {
        state.isLikePending = false;
        state.likeMessage =
          action.payload ?? "Не удалось обновить лайк. Попробуйте позже.";

        const { trackId, liked, userId } = action.meta.arg;
        const track = findTrackById(state, trackId);
        if (!track) return;

        const reverted = applyLikeToTrack(track, userId, !liked);
        patchTrackEverywhere(state, trackId, reverted);
        syncFavoriteList(state, trackId, reverted, !liked);
      })
      .addCase(logout, (state) => {
        state.favoriteTracks = [];
        state.favoritesError = null;
        state.likeMessage = null;
      });
  },
});

export const {
  setPlaylist,
  setCurrentTrack,
  setIsPlaying,
  togglePlayback,
  nextTrack,
  prevTrack,
  playNextAfterEnd,
  toggleShuffle,
  toggleRepeat,
  clearLikeMessage,
  setLikeMessage,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;
