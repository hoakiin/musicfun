import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/model/store";
import {
  selectCurrentTrack,
  selectQueue,
  selectShuffle,
  selectRepeat,
  setShuffle,
  setRepeat,
  type RepeatMode,
} from "../model/playerSlice";
import { triggerPlay } from "../lib/playController";

const REPEAT_CYCLE: RepeatMode[] = ["off", "all", "one"];

export const usePlayerControls = () => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(selectCurrentTrack);
  const queue = useAppSelector(selectQueue);
  const shuffle = useAppSelector(selectShuffle);
  const repeat = useAppSelector(selectRepeat);

  const getNextIndex = useCallback(
    (direction: 1 | -1): number => {
      if (queue.length === 0) return -1;
      if (!currentTrack) return 0;

      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

      if (shuffle) {
        const available = queue.filter((t) => t.id !== currentTrack.id);
        if (available.length === 0) return -1;
        const randomIndex = Math.floor(Math.random() * available.length);
        return queue.findIndex((t) => t.id === available[randomIndex].id);
      }

      let nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        if (repeat === "all") {
          nextIndex = queue.length - 1;
        } else {
          nextIndex = 0;
        }
      } else if (nextIndex >= queue.length) {
        if (repeat === "all") {
          nextIndex = 0;
        } else {
          return -1;
        }
      }

      return nextIndex;
    },
    [queue, currentTrack, shuffle, repeat],
  );

  const next = useCallback(() => {
    const index = getNextIndex(1);
    if (index < 0) return;
    triggerPlay(queue[index]);
  }, [queue, getNextIndex]);

  const prev = useCallback(() => {
    const index = getNextIndex(-1);
    if (index < 0) return;
    triggerPlay(queue[index]);
  }, [queue, getNextIndex]);

  const toggleShuffle = useCallback(() => {
    dispatch(setShuffle(!shuffle));
  }, [dispatch, shuffle]);

  const cycleRepeat = useCallback(() => {
    const currentIndex = REPEAT_CYCLE.indexOf(repeat);
    const nextMode = REPEAT_CYCLE[(currentIndex + 1) % REPEAT_CYCLE.length];
    dispatch(setRepeat(nextMode));
  }, [dispatch, repeat]);

  return {
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    shuffle,
    repeat,
  };
};
