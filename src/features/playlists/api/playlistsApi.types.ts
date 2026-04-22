import type z from "zod";
import type {
  playlistMetaSchema,
  playlistAttributesSchema,
  playlistDataSchema,
  playlistsResponseSchema,
  createPlaylistSchema,
} from "../model/playlists.schemas";

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>;
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
