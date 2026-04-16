import { baseApi } from "@/app/api/baseApi";
import type {
  CreatePlaylistFormValues,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "./playlistsApi.types";
import type { Images } from "@/common/types";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
        query: (params) => {
          return {
            url: "/playlists",
            params,
          };
        },
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
        query: ({ playlistId, body }) => {
          console.log("4");

          return {
            method: "put",
            url: `/playlists/${playlistId}`,
            body: {
              data: {
                type: "playlists",
                attributes: body,
              },
            },
          };
        },
        async onQueryStarted(
          { playlistId, body },
          { dispatch, queryFulfilled, getState },
        ) {
          console.log("1");

          const args = playlistsApi.util.selectCachedArgsForQuery(
            getState(),
            "fetchPlaylists",
          );

          const patchResults: any[] = [];

          args.forEach((arg) => {
            patchResults.push(
              dispatch(
                playlistsApi.util.updateQueryData(
                  "fetchPlaylists",
                  {
                    pageNumber: arg.pageNumber,
                    pageSize: arg.pageSize,
                    search: arg.search,
                  },
                  (state) => {
                    console.log("2");

                    const index = state.data.findIndex(
                      (playlist) => playlist.id === playlistId,
                    );
                    if (index !== -1) {
                      state.data[index].attributes = {
                        ...state.data[index].attributes,
                        ...body,
                      };
                    }
                  },
                ),
              ),
            );
          });

          try {
            console.log("3");

            await queryFulfilled;

            console.log("5 success");
          } catch (e) {
            patchResults.forEach((patchResult) => {
              patchResult.undo();
            });

            console.log("5 error");
          }
        },
        invalidatesTags: ["Playlist"],
      }),
      uploadPlaylistCover: build.mutation<
        Images,
        { playlistId: string; file: File }
      >({
        query: ({ playlistId, file }) => {
          const formData = new FormData();
          formData.append("file", file);

          return {
            method: "post",
            url: `/playlists/${playlistId}/images/main`,
            body: formData,
          };
        },
        invalidatesTags: ["Playlist"],
      }),
      deletePlaylistCover: build.mutation<void, { playlistId: string }>({
        query: ({ playlistId }) => ({
          method: "delete",
          url: `/playlists/${playlistId}/images/main`,
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
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi;
