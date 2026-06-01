import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getAllTracks } from "@/api/tracksApi";
import type { Track } from "@/types";

export type TrackSliceState = {
  allTracks: Track[];
  orderedPlaylist: Track[];
  initialPlaylist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isLoading: boolean;
  error: string | null;
};

function shuffleCopy<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const initialState: TrackSliceState = {
  allTracks: [],
  orderedPlaylist: [],
  initialPlaylist: [],
  currentIndex: -1,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  isLoading: false,
  error: null,
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
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;
