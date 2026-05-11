import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Track } from "@/mocks/tracks";

export type TrackSliceState = {
  currentTrack: Track | null;
  isPlaying: boolean;
};

const initialState: TrackSliceState = {
  currentTrack: null,
  isPlaying: false,
};

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    togglePlayback: (state) => {
      if (state.currentTrack) {
        state.isPlaying = !state.isPlaying;
      }
    },
    trackPlaybackEnded: (state) => {
      state.isPlaying = false;
    },
  },
});

export const { setCurrentTrack, setIsPlaying, togglePlayback, trackPlaybackEnded } =
  trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
