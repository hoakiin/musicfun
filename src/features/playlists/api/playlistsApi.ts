import { baseApi } from "@/app/api/baseApi";
import { SOCKET_EVENTS } from "@/common/constants";
import { imagesSchema } from "@/common/schemas";
import { subscribeToEvent } from "@/common/socket";
import type { Images } from "@/common/types";
import { withZodCatch } from "@/common/utils";
import {
  playlistCreateResponseSchema,
  playlistResponseSchema,
  playlistsResponseSchema,
} from "../model/playlists.schemas";
import type {
  CreatePlaylistFormValues,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistReactionResponse,
  PlaylistsResponse,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from "./playlistsApi.types";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
        query: ({ tagsIds, ...params }) => {
          return {
            url: "/playlists",
            params: {
              ...params,
              ...(tagsIds?.length ? { tagsIds: tagsIds.join(",") } : {}),
            },
          };
        },
        ...withZodCatch(playlistsResponseSchema),
        keepUnusedDataFor: 0,
        onCacheEntryAdded: async (
          _arg,
          { cacheDataLoaded, updateCachedData, cacheEntryRemoved },
        ) => {
          await cacheDataLoaded;

          const unsubscribes = [
            subscribeToEvent<PlaylistCreatedEvent>(
              SOCKET_EVENTS.PLAYLIST_CREATED,
              (msg) => {
                const newPlaylist = msg.payload.data;
                updateCachedData((state) => {
                  state.data.pop();
                  state.data.unshift(newPlaylist);
                  state.meta.totalCount = state.meta.totalCount + 1;
                  state.meta.pagesCount = Math.ceil(
                    state.meta.totalCount / state.meta.pageSize,
                  );
                });
              },
            ),
            subscribeToEvent<PlaylistUpdatedEvent>(
              SOCKET_EVENTS.PLAYLIST_UPDATED,
              (msg) => {
                const newPlaylist = msg.payload.data;
                updateCachedData((state) => {
                  const index = state.data.findIndex(
                    (playlist) => playlist.id === newPlaylist.id,
                  );
                  if (index !== 1) {
                    state.data[index] = {
                      ...state.data[index],
                      ...newPlaylist,
                    };
                  }
                });
              },
            ),
          ];

          await cacheEntryRemoved;
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        },
        providesTags: ["Playlist"],
      }),
      fetchPlaylist: build.query<
        { data: PlaylistData },
        string
      >({
        query: (playlistId) => ({
          url: `/playlists/${playlistId}`,
        }),
        ...withZodCatch(playlistResponseSchema),
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
        ...withZodCatch(playlistCreateResponseSchema),
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
            await queryFulfilled;
          } catch (e) {
            patchResults.forEach((patchResult) => {
              patchResult.undo();
            });
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
        ...withZodCatch(imagesSchema),
        invalidatesTags: ["Playlist"],
      }),
      deletePlaylistCover: build.mutation<void, { playlistId: string }>({
        query: ({ playlistId }) => ({
          method: "delete",
          url: `/playlists/${playlistId}/images/main`,
        }),
        invalidatesTags: ["Playlist"],
      }),
      likePlaylist: build.mutation<PlaylistReactionResponse, string>({
        query: (playlistId) => ({
          method: "post",
          url: `/playlists/${playlistId}/likes`,
        }),
        invalidatesTags: ["Playlist"],
      }),
      dislikePlaylist: build.mutation<PlaylistReactionResponse, string>({
        query: (playlistId) => ({
          method: "post",
          url: `/playlists/${playlistId}/dislikes`,
        }),
        invalidatesTags: ["Playlist"],
      }),
    };
  },
});

export const {
  useFetchPlaylistsQuery,
  useFetchPlaylistQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
  useLikePlaylistMutation,
  useDislikePlaylistMutation,
} = playlistsApi;
