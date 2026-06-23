import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/model/store";
import { selectCurrentTrack, setTrack } from "../../model/playerSlice";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { setPlayerHandler } from "../../lib/playController";
import { playerStore } from "../../lib/playerStore";
import { usePlayerControls } from "../../hooks/usePlayerControls";
import { formatDuration } from "@/common/utils";
import { Icon } from "@/common/components/Icon/Icon";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import s from "./PlayerBar.module.css";

export const PlayerBar = () => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(selectCurrentTrack);

  const progressRef = useRef<HTMLDivElement | null>(null);
  const { next, prev, toggleShuffle, cycleRepeat, shuffle, repeat } = usePlayerControls();

  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;

  const { currentTime, duration, volume, isPlaying, audioRef, play, pause, seek, setVolume } =
    useAudioPlayer();

  const playRef = useRef(play);
  playRef.current = play;

  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatRef.current === "one" && currentTrackRef.current) {
        const url = currentTrackRef.current.attributes.attachments[0]?.url;
        if (url) playRef.current(url);
      } else {
        nextRef.current();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [audioRef, dispatch]);

  useEffect(() => {
    setPlayerHandler({
      playTrack: (track) => {
        dispatch(setTrack(track));
        const url = track.attributes.attachments[0]?.url;
        if (url) play(url);
      },
      togglePlay: () => {
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      },
    });

    return () => setPlayerHandler(null);
  }, [dispatch, play, isPlaying, pause, currentTrack]);

  useEffect(() => {
    playerStore.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    playerStore.duration = duration;
  }, [duration]);

  useEffect(() => {
    playerStore.isPlaying = isPlaying;
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const { title, user, images } = currentTrack?.attributes ?? {};
  const originalCover = images?.main?.find((img) => img.type === "original");
  const coverSrc = originalCover ? originalCover.url : defaultCover;

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {currentTrack && (
        <div className={s.bar}>
          <div className={s.left}>
            <img src={coverSrc} alt={title} className={s.cover} />
            <div className={s.trackInfo}>
              <span className={s.trackTitle}>{title}</span>
              <span className={s.trackArtist}>{user?.name}</span>
            </div>
          </div>

          <div className={s.center}>
            <div className={s.controls}>
              <button
                className={`${s.skipBtn} ${shuffle ? s.active : ""}`}
                onClick={toggleShuffle}
                title="Shuffle"
              >
                <Icon iconId="shuffle" width="20" height="20" viewBox="0 0 32 32" />
              </button>
              <button className={s.skipBtn} onClick={prev} title="Previous">
                <Icon iconId="prev" width="20" height="20" viewBox="0 0 32 32" />
              </button>
              <button className={`${s.playBtn} ${isPlaying ? s.playing : ''}`} onClick={handlePlayToggle}>
                {isPlaying ? (
                  <Icon iconId="pause" width="36" height="36" viewBox="0 0 40 40" />
                ) : (
                  <Icon iconId="play" width="36" height="36" viewBox="0 0 40 40" />
                )}
              </button>
              <button className={s.skipBtn} onClick={next} title="Next">
                <Icon iconId="next" width="20" height="20" viewBox="0 0 32 32" />
              </button>
              <button
                className={`${s.skipBtn} ${repeat !== "off" ? s.active : ""}`}
                onClick={cycleRepeat}
                title={`Repeat: ${repeat}`}
              >
                <Icon iconId="repeat" width="20" height="20" viewBox="0 0 32 32" />
              </button>
            </div>

            <div className={s.progressWrapper}>
              <span className={s.time}>
                {formatDuration(Math.floor(currentTime))}
              </span>
              <div
                ref={progressRef}
                className={s.progressBar}
                onClick={handleProgressClick}
              >
                <div
                  className={s.progressFill}
                  style={{ width: `${progress}%` }}
                >
                  <div className={s.progressThumb} />
                </div>
              </div>
              <span className={s.time}>
                {formatDuration(Math.floor(duration))}
              </span>
            </div>
          </div>

          <div className={s.right}>
            <Icon iconId="volume" width="20" height="20" viewBox="0 0 32 32" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.currentTarget.value))}
              className={s.volumeSlider}
            />
          </div>
        </div>
      )}
    </>
  );
};
