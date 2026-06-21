import { baseApi } from "@/app/api/baseApi";
import type { FetchTracksArgs, FetchTracksResponse, TrackReactionResponse } from "./tracksApi.types";
import { withZodCatch } from "@/common/utils";
import { fetchTracksResponseSchema } from "../model/tracks.schemas";

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
        },
      }),
      ...withZodCatch(fetchTracksResponseSchema)
    }),
    likeTrack: build.mutation<TrackReactionResponse, string>({
      query: (trackId) => ({
        method: "post",
        url: `/playlists/tracks/${trackId}/likes`,
      }),
    }),
    dislikeTrack: build.mutation<TrackReactionResponse, string>({
      query: (trackId) => ({
        method: "post",
        url: `/playlists/tracks/${trackId}/dislikes`,
      }),
    }),
  }),
});
export const { useFetchTracksInfiniteQuery, useLikeTrackMutation, useDislikeTrackMutation } = tracksApi;
