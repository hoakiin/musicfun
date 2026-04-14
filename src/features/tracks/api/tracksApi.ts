import { baseApi } from "@/app/api/baseApi";
import type { FetchTracksResponse } from "./tracksApi.types";

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor || null;
        },
      },
      query: ({ pageParam }) => ({
        url: "playlists/tracks",
        params: { cursor: pageParam, paginationType: "cursor", pageSize: 5 },
      }),
    }),
  }),
});
export const { useFetchTracksInfiniteQuery } = tracksApi;
