import type { TrackData } from "@/features/tracks/api/tracksApi.types";

type PlayHandler = {
  playTrack: (track: TrackData) => void;
  togglePlay: () => void;
};

let _handler: PlayHandler | null = null;

export const setPlayerHandler = (handler: PlayHandler | null) => {
  _handler = handler;
};

export const triggerPlay = (track: TrackData) => {
  _handler?.playTrack(track);
};

export const triggerTogglePlay = () => {
  _handler?.togglePlay();
};
