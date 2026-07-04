import { useState } from "react";
import { useParams } from "react-router";
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi";
import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi";
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList";
import { TracksList } from "@/features/tracks/ui/TracksPage/TracksList/TracksList";
import s from "@/features/auth/ui/ProfilePage/ProfilePage.module.css";

type Tab = "playlists" | "tracks";

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("playlists");

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } =
    useFetchPlaylistsQuery(
      { userId, pageSize: 20 },
      { skip: !userId },
    );

  const { data: tracksResponse } = useFetchTracksInfiniteQuery(
    { userId, pageSize: 20 },
    { skip: !userId },
  );

  const tracks = tracksResponse?.pages.flatMap((page) => page.data) || [];
  const tracksCount =
    tracksResponse?.pages[0]?.meta.totalCount ?? tracks.length;
  const playlistsCount = playlistsResponse?.meta.totalCount ?? 0;

  const userName =
    playlistsResponse?.data[0]?.attributes.user.name ??
    tracks[0]?.attributes.user.name ??
    "User";

  const renderContent = () => {
    switch (activeTab) {
      case "playlists":
        return (
          <PlaylistsList
            isPlaylistsLoading={isPlaylistsLoading}
            playlists={playlistsResponse?.data || []}
          />
        );
      case "tracks":
        return <TracksList tracks={tracks} />;
    }
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.avatar}>{userName[0].toUpperCase()}</div>
        <h1 className={s.login}>{userName}</h1>
        <div className={s.stats}>
          <div>
            <span className={s.statsNum}>{playlistsCount}</span>
            <span>playlists</span>
          </div>
          <div>
            <span className={s.statsNum}>{tracksCount}</span>
            <span>tracks</span>
          </div>
        </div>
      </div>

      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === "playlists" ? s.activeTab : ""}`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>
        <button
          className={`${s.tab} ${activeTab === "tracks" ? s.activeTab : ""}`}
          onClick={() => setActiveTab("tracks")}
        >
          Tracks
        </button>
      </div>

      <div className={s.content}>{renderContent()}</div>
    </div>
  );
};
