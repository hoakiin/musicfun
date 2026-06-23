import { useFetchPlaylistTracksQuery } from "../../api/playlistsApi";
import type { TrackData } from "@/features/tracks/api/tracksApi.types";
import type { PlaylistTracksIncluded } from "../../api/playlistsApi.types";
import { useAppDispatch } from "@/app/model/store";
import { setQueue } from "@/features/player/model/playerSlice";
import { useEffect, useMemo } from "react";

export const usePlaylistTracks = (playlistId: string | undefined) => {
  const dispatch = useAppDispatch();
  const { data: tracksData, isLoading: tracksLoading } = useFetchPlaylistTracksQuery(
    { playlistId: playlistId! },
    { skip: !playlistId },
  );

  const tracks = tracksData?.data ?? [];
  const included = tracksData?.included ?? [];

  const tracksAsTrackData = useMemo<TrackData[]>(() => {
    return tracks.map((track) => {
      const artistNames = track.relationships.artists.data
        .map((ref) => included.find((inc) => inc.id === ref.id))
        .filter(Boolean)
        .map((artist) => (artist as PlaylistTracksIncluded).attributes.name)
        .join(", ");

      return {
        id: track.id,
        type: "tracks" as const,
        attributes: {
          title: track.attributes.title,
          addedAt: track.attributes.addedAt,
          attachments: track.attributes.attachments,
          images: track.attributes.images,
          currentUserReaction: track.attributes.currentUserReaction,
          user: { id: "", name: artistNames },
          isPublished: true,
          publishedAt: track.attributes.publishedAt,
          duration: track.attributes.duration,
          likesCount: 0,
        },
        relationships: track.relationships,
      };
    });
  }, [tracks, included]);

  useEffect(() => {
    dispatch(setQueue(tracksAsTrackData));
  }, [dispatch, tracksAsTrackData]);

  return { tracksAsTrackData, tracksLoading };
};
