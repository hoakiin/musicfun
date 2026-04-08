import { baseApi } from "@/app/api/baseApi";
import type {
  CreatePlaylistFormValues,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "./playlistsApi.types";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchPlaylists: build.query<PlaylistsResponse, void>({
        query: () => "/playlists",
        providesTags: ["Playlist"],
      }),
      createPlaylist: build.mutation<
        { data: PlaylistData },
        CreatePlaylistFormValues
      >({
        query: (body) => ({
          method: "post",
          url: "playlists",
          body: {
            data: {
              type: "playlists",
              attributes: body,
            },
          },
        }),
        invalidatesTags: ["Playlist"],
      }),
      deletePlaylist: build.mutation<void, string>({
        query: (playlistId) => ({
          method: "delete",
          url: `/playlists/${playlistId}`,
        }),
        invalidatesTags: ["Playlist"],
      }),
      updatePlaylist: build.mutation<
        void,
        { playlistId: string; body: UpdatePlaylistArgs }
      >({
        query: ({ playlistId, body }) => ({
          method: "put",
          url: `/playlists/${playlistId}`,
          body: {
            data: {
              type: "playlists",
              attributes: body,
            },
          },
        }),
        invalidatesTags: ["Playlist"],
      }),
    };
  },
});

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi;
