import { baseApi } from "@/app/api/baseApi";
import type { ArtistRef } from "../model/artists.schemas";
import type { SearchArtistsParams } from "./artistsApi.types";

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchArtists: builder.query<ArtistRef[], SearchArtistsParams>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) {
          params.search = search;
        }

        return {
          url: "/artists/search",
          params,
        };
      },
    }),
  }),
});

export const { useSearchArtistsQuery } = artistsApi;
