import { createContext, useContext } from "react";
import type { TrackData } from "@/features/tracks/api/tracksApi.types";

type PlayerContextValue = {
  playTrack: (track: TrackData) => void;
  togglePlay: () => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);

export const usePlayerContext = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayerContext must be used within PlayerProvider");
  return ctx;
};
