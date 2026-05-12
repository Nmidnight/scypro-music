import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { data } from "@/mocks/tracks";
import type { Track } from "@/mocks/tracks";

export type TrackSliceState = {
  orderedPlaylist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
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
  orderedPlaylist: [...data],
  currentIndex: -1,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
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

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      const idx = state.orderedPlaylist.findIndex((t) => t._id === action.payload._id);
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
      if (state.currentIndex < 0 || state.currentIndex >= state.orderedPlaylist.length - 1) {
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
        state.currentIndex >= 0 ? state.orderedPlaylist[state.currentIndex]._id : null;
      state.isShuffle = !state.isShuffle;
      if (state.isShuffle) {
        state.orderedPlaylist = shuffleCopy(state.orderedPlaylist);
      } else {
        state.orderedPlaylist = [...data];
      }
      if (prevId != null) {
        const idx = state.orderedPlaylist.findIndex((t) => t._id === prevId);
        state.currentIndex = idx;
      }
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
  },
});

export const {
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
