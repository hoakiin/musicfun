import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi";
import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi";
import { PlaylistCover } from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover";
import { PlaylistDescription } from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistDescription/PlaylistDescription";
import { PlaylistListSkeleton } from "@/features/playlists/ui/PlaylistsPage/PlaylistListSkeleton/PlaylistListSkeleton";
import { TrackCard } from "@/features/tracks/ui/TrackCard/TrackCard";
import { TrackCardSkeleton } from "@/features/tracks/ui/TrackCardSkeleton/TrackCardSkeleton";
import { Link } from "react-router";
import s from "./MainPage.module.css";

const TAGS = ["Playlists", "Artists", "Albums", "Podcasts & shows"];

export const MainPage = () => {
  const { data: playlistsData, isLoading: isPlaylistsLoading, isError: isPlaylistsError } = useFetchPlaylistsQuery({
    sortBy: "addedAt",
    sortDirection: "desc",
    pageSize: 10,
    pageNumber: 1,
  });

  const { data: tracksData, isLoading: isTracksLoading, isError: isTracksError } = useFetchTracksInfiniteQuery({
    sortBy: "publishedAt",
    sortDirection: "desc",
    pageSize: 10,
    paginationType: "cursor",
  });

  const playlists = playlistsData?.data ?? [];
  const tracks = tracksData?.pages[0]?.data ?? [];
  const included = tracksData?.pages[0]?.included ?? [];

  return (
    <div className={s.container}>
      <div className={s.tags}>
        {TAGS.map((tag) => (
          <span key={tag} className={s.tag}>
            #{tag}
          </span>
        ))}
      </div>

      <section>
        <h2 className={s.sectionTitle}>New Playlists</h2>
        {isPlaylistsLoading ? (
          <PlaylistListSkeleton count={10} />
        ) : isPlaylistsError ? (
          <p className={s.error}>Failed to load playlists</p>
        ) : (
          <div className={s.playlistsGrid}>
            {playlists.map((playlist) => (
              <Link
                to={`/playlists/${playlist.id}`}
                key={playlist.id}
                className={s.playlistItem}
              >
                <PlaylistCover images={playlist.attributes.images} />
                <PlaylistDescription
                  id={playlist.id}
                  attributes={playlist.attributes}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className={s.sectionTitle}>New Tracks</h2>
        {isTracksLoading ? (
          <div className={s.tracksGrid}>
            <TrackCardSkeleton count={10} />
          </div>
        ) : isTracksError ? (
          <p className={s.error}>Failed to load tracks</p>
        ) : (
          <div className={s.tracksGrid}>
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} included={included} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
