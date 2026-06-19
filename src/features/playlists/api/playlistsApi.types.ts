import type z from "zod";
import type {
  playlistMetaSchema,
  playlistListAttributesSchema,
  playlistListDataSchema,
  playlistAttributesSchema,
  playlistDataSchema,
  playlistsResponseSchema,
  createPlaylistSchema,
} from "../model/playlists.schemas";

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>;
export type PlaylistListAttributes = z.infer<typeof playlistListAttributesSchema>;
export type PlaylistListData = z.infer<typeof playlistListDataSchema>;
export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>;
export type PlaylistData = z.infer<typeof playlistDataSchema>;
export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>;

// Arguments

export type CreatePlaylistFormValues = z.infer<typeof createPlaylistSchema>;

export type FetchPlaylistsArgs = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "addedAt" | "likesCount";
  sortDirection?: "asc" | "desc";
  tagsIds?: string[];
  userId?: string;
  trackId?: string;
};

export type UpdatePlaylistArgs = {
  title: string;
  description: string;
  tagIds: string[];
};

// WebSocket Events
export type PlaylistCreatedEvent = {
  type: 'tracks.playlist-created'
  payload: {
    data: PlaylistData
  }
}

export type PlaylistUpdatedEvent = {
  type: 'tracks.playlist-updated'
  payload: {
    data: PlaylistData
  }
}
