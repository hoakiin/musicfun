export const AUTH_KEYS = {
  accessToken: 'musicfun-access-token',
  refreshToken: 'musicfun-refresh-token',
} as const

export const SOCKET_EVENTS = {
  TRACK_PUBLISHED: 'tracks.track-published',
  TRACK_ADDED_TO_PLAYLIST: 'tracks.track-added-to-playlist',
  TRACK_LIKED: 'tracks.track-liked',
  TRACK_IMAGE_PROCESSED: 'tracks.track-image-processed',
  PLAYLIST_IMAGE_PROCESSED: 'tracks.playlist-image-processed',
  PLAYLIST_CREATED: 'tracks.playlist-created',
  PLAYLIST_UPDATED: 'tracks.playlist-updated',
} as const

export type SocketEvents = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

export const PAGE_GRADIENTS: Record<string, string> = {
  "/playlists/": "linear-gradient(180deg, rgba(173, 191, 34, 1) 0%, rgba(120, 140, 20, 1) 8%, rgba(60, 70, 10, 1) 26%, rgba(18, 18, 18, 1) 35%)",
  "/tracks/": "linear-gradient(180deg, rgba(154, 52, 38, 1) 0%, rgba(120, 30, 20, 1) 8%, rgba(60, 15, 10, 1) 26%, rgba(18, 18, 18, 1) 35%)",
  "/profile": "linear-gradient(180deg, rgba(184, 166, 97, 1) 0%, rgba(140, 120, 60, 1) 8%, rgba(70, 60, 30, 1) 26%, rgba(18, 18, 18, 1) 35%)",
  "/library": "linear-gradient(180deg, rgba(184, 166, 97, 1) 0%, rgba(140, 120, 60, 1) 8%, rgba(70, 60, 30, 1) 26%, rgba(18, 18, 18, 1) 35%)",
} as const