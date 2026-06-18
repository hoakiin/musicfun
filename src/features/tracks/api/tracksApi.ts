import { baseApi } from "@/app/api/baseApi";
import type { FetchTracksArgs, FetchTracksResponse } from "./tracksApi.types";
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
          pageSize: 5,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortDirection: queryArg.sortDirection,
          tagsIds: queryArg.tagsIds?.join(","),
          artistsIds: queryArg.artistsIds?.join(","),
        },
      }),
      ...withZodCatch(fetchTracksResponseSchema)
    }),
  }),
});
export const { useFetchTracksInfiniteQuery } = tracksApi;
