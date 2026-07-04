import { baseApi } from "@/app/api/baseApi";
import { imagesSchema } from "@/common/schemas";
import type { Images } from "@/common/types";
import { withZodCatch } from "@/common/utils";
import { fetchTracksResponseSchema } from "../model/tracks.schemas";
import type { FetchTracksArgs, FetchTracksResponse, TrackReactionResponse, TrackUploadArgs } from "./tracksApi.types";

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, FetchTracksArgs, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor || null;
        },
      },
      query: ({ pageParam, queryArg }) => ({
        url: "playlists/tracks",
        params: {
          cursor: pageParam,
          paginationType: "cursor",
          pageSize: queryArg.pageSize ?? 5,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortDirection: queryArg.sortDirection,
          tagsIds: queryArg.tagsIds?.join(","),
          artistsIds: queryArg.artistsIds?.join(","),
          userId: queryArg.userId,
          onlyLikedByMe: queryArg.onlyLikedByMe,
        },
      }),
      ...withZodCatch(fetchTracksResponseSchema),
      providesTags: ["Track"],
    }),
    likeTrack: build.mutation<TrackReactionResponse, string>({
      query: (trackId) => ({
        method: "post",
        url: `/playlists/tracks/${trackId}/likes`,
      }),
      invalidatesTags: ["Track"],
    }),
    dislikeTrack: build.mutation<TrackReactionResponse, string>({
      query: (trackId) => ({
        method: "post",
        url: `/playlists/tracks/${trackId}/dislikes`,
      }),
      invalidatesTags: ["Track"],
    }),
    uploadTrack: build.mutation<{ data: { id: string } }, TrackUploadArgs>({
      query: ({ title, file }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify({
          type: "tracks",
          attributes: {
            title,
            data: "",
          },
        }));
        formData.append("file", file);

        return {
          method: "post",
          url: "/playlists/tracks/upload",
          body: formData,
        };
      },
      invalidatesTags: ["Track"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(["Track"]));
        } catch {}
      },
    }),
    uploadTrackCover: build.mutation<Images, { trackId: string; file: File }>({
      query: ({ trackId, file }) => {
        const formData = new FormData();
        formData.append("cover", file);

        return {
          method: "post",
          url: `/playlists/tracks/${trackId}/cover`,
          body: formData,
        };
      },
      ...withZodCatch(imagesSchema),
    }),
    deleteTrackCover: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        method: "delete",
        url: `/playlists/tracks/${trackId}/cover`,
      }),
    }),
    addTrackToPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ playlistId, trackId }) => ({
        method: "post",
        url: `/playlists/${playlistId}/relationships/tracks`,
        body: {
          data: {
            type: "playlist-tracks",
            attributes: {
              trackId,
            },
          },
        },
      }),
      invalidatesTags: ["Playlist"],
    }),
    publishTrack: build.mutation<void, string>({
      query: (trackId) => ({
        method: "post",
        url: `/playlists/tracks/${trackId}/actions/publish`,
      }),
      invalidatesTags: ["Track"],
    }),
  }),
});
export const { useFetchTracksInfiniteQuery, useLikeTrackMutation, useDislikeTrackMutation, useUploadTrackMutation, useUploadTrackCoverMutation, useDeleteTrackCoverMutation, useAddTrackToPlaylistMutation, usePublishTrackMutation } = tracksApi;
