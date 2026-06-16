import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TrackData } from "@/features/tracks/api/tracksApi.types";

export type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  currentTrack: TrackData | null;
  queue: TrackData[];
  shuffle: boolean;
  repeat: RepeatMode;
};

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  shuffle: false,
  repeat: "off",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setTrack(state, action: PayloadAction<TrackData | null>) {
      state.currentTrack = action.payload;
    },
    setQueue(state, action: PayloadAction<TrackData[]>) {
      state.queue = action.payload;
    },
    setShuffle(state, action: PayloadAction<boolean>) {
      state.shuffle = action.payload;
    },
    setRepeat(state, action: PayloadAction<RepeatMode>) {
      state.repeat = action.payload;
    },
  },
});

export const { setTrack, setQueue, setShuffle, setRepeat } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;

export const selectCurrentTrack = (state: { player: PlayerState }) =>
  state.player.currentTrack;

export const selectQueue = (state: { player: PlayerState }) =>
  state.player.queue;

export const selectShuffle = (state: { player: PlayerState }) =>
  state.player.shuffle;

export const selectRepeat = (state: { player: PlayerState }) =>
  state.player.repeat;
