import {
  tagSchema,
  imagesSchema,
  userSchema,
  currentUserReactionSchema,
} from "@/common/schemas";
import * as z from "zod";

export const createPlaylistSchema = z.object({
  title: z
    .string()
    .min(1, "The title length must be more than 1 character")
    .max(100, "The title length must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "The description length must be less than 1000 characters."),
});

export const playlistMetaSchema = z.object({
  page: z.int().positive(),
  pageSize: z.int().positive(),
  totalCount: z.int().nonnegative(),
  pagesCount: z.int().nonnegative(),
});


export const playlistListAttributesSchema = z.object({
  title: z.string(),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  order: z.number().int(),
  tags: z.array(tagSchema),
  images: imagesSchema,
  user: userSchema,
  likesCount: z.number().int().nonnegative(),
  dislikesCount: z.number().int().nonnegative(),
  currentUserReaction: currentUserReactionSchema,
  tracksCount: z.number().int().nonnegative(),
  duration: z.number().int().nonnegative(),
});

export const playlistAttributesSchema = playlistListAttributesSchema.extend({
  description: z.string(),
});

export const playlistListDataSchema = z.object({
  id: z.string(),
  type: z.literal("playlists"),
  attributes: playlistListAttributesSchema,
});

export const playlistDataSchema = z.object({
  id: z.string(),
  type: z.literal("playlists"),
  attributes: playlistAttributesSchema,
});

export const playlistsResponseSchema = z.object({
  data: z.array(playlistListDataSchema),
  meta: playlistMetaSchema,
});

export const playlistCreateResponseSchema = z.object({
  data: playlistDataSchema,
});

export const playlistResponseSchema = z.object({
  data: playlistDataSchema,
});

// --- Playlist Tracks ---

export const playlistTrackAttachmentSchema = z.object({
  id: z.string(),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  version: z.int().nonnegative(),
  url: z.string(),
  contentType: z.string(),
  originalName: z.string(),
  fileSize: z.int().nonnegative(),
});

export const playlistTrackRelationshipsSchema = z.object({
  artists: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        type: z.literal("artists"),
      }),
    ),
  }),
});

export const playlistTrackAttributesSchema = z.object({
  title: z.string(),
  order: z.number().int(),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  attachments: z.array(playlistTrackAttachmentSchema),
  images: imagesSchema,
  currentUserReaction: currentUserReactionSchema,
  publishedAt: z.iso.datetime().nullable(),
  duration: z.number().int().nonnegative(),
});

export const playlistTrackDataSchema = z.object({
  id: z.string(),
  type: z.literal("tracks"),
  attributes: playlistTrackAttributesSchema,
  relationships: playlistTrackRelationshipsSchema,
});

export const playlistTracksIncludedSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    name: z.string(),
  }),
});

export const playlistTracksMetaSchema = z.object({
  totalCount: z.number().int().nonnegative(),
});

export const fetchPlaylistTracksResponseSchema = z.object({
  data: z.array(playlistTrackDataSchema),
  meta: playlistTracksMetaSchema,
  included: z.array(playlistTracksIncludedSchema),
});
