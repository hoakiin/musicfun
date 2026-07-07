import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useFetchPlaylistQuery } from "../../api/playlistsApi";
import { TracksList } from "@/features/tracks/ui/TracksPage/TracksList/TracksList";
import { TracksListSkeleton } from "@/features/tracks/ui/TracksPage/TracksListSkeleton/TracksListSkeleton";
import { useAppSelector } from "@/app/model/store";
import { selectCurrentTrack } from "@/features/player/model/playerSlice";
import { triggerPlay, triggerTogglePlay } from "@/features/player/lib/playController";
import { playerStore } from "@/features/player/lib/playerStore";
import { usePlaylistTracks } from "./usePlaylistTracks";
import { PlaylistHeader } from "./PlaylistHeader/PlaylistHeader";
import { PlaylistPageSkeleton } from "./PlaylistPageSkeleton/PlaylistPageSkeleton";
import s from "./PlaylistPage.module.css";

export const PlaylistPage = () => {
  const currentTrack = useAppSelector(selectCurrentTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data: playlistData, isLoading: playlistLoading } = useFetchPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });
  const { tracksAsTrackData, tracksLoading } = usePlaylistTracks(playlistId);

  useEffect(() => {
    const unsub = playerStore.subscribe(() => {
      setIsPlaying(playerStore.isPlaying);
    });
    return unsub;
  }, []);

  const handlePlay = () => {
    const firstTrack = tracksAsTrackData[0];
    if (!firstTrack) return;
    if (currentTrack?.id === firstTrack.id) {
      triggerTogglePlay();
    } else {
      triggerPlay(firstTrack);
    }
  };

  const isFirstTrackActive = currentTrack?.id === tracksAsTrackData[0]?.id;
  const showPause = isFirstTrackActive && isPlaying;

  if (playlistLoading || !playlistData) {
    return <PlaylistPageSkeleton />;
  }

  return (
    <div className={s.container}>
      <PlaylistHeader
        playlist={playlistData.data}
        hasTracks={tracksAsTrackData.length > 0}
        showPause={showPause}
        onPlay={handlePlay}
      />

      {tracksLoading && <TracksListSkeleton count={8} />}

      {!tracksLoading && tracksAsTrackData.length > 0 && <TracksList tracks={tracksAsTrackData} playlistId={playlistId} />}
    </div>
  );
};
