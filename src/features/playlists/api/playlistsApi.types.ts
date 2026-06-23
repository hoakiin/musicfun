import type z from "zod";
import type {
  playlistMetaSchema,
  playlistListAttributesSchema,
  playlistListDataSchema,
  playlistAttributesSchema,
  playlistDataSchema,
  playlistsResponseSchema,
  createPlaylistSchema,
  playlistTrackAttributesSchema,
  playlistTrackDataSchema,
  playlistTracksIncludedSchema,
  playlistTracksMetaSchema,
  fetchPlaylistTracksResponseSchema,
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

export type PlaylistReactionResponse = {
  objectId: string
  value: number
  likes: number
  dislikes: number
}

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

export type PlaylistTrackAttributes = z.infer<typeof playlistTrackAttributesSchema>;
export type PlaylistTrackData = z.infer<typeof playlistTrackDataSchema>;
export type PlaylistTracksIncluded = z.infer<typeof playlistTracksIncludedSchema>;
export type PlaylistTracksMeta = z.infer<typeof playlistTracksMetaSchema>;
export type FetchPlaylistTracksResponse = z.infer<typeof fetchPlaylistTracksResponseSchema>;

export type FetchPlaylistTracksArgs = {
  pageNumber?: number;
  pageSize?: number;
};
