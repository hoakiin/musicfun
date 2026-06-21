import { useState } from "react";
import { Navigate } from "react-router";
import { useGetMeQuery } from "../../api/authApi";
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi";
import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi";
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList";
import { TracksList } from "@/features/tracks/ui/TracksPage/TracksList/TracksList";
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm";
import { Path } from "@/common/routing";
import s from "./ProfilePage.module.css";

type Tab = "my-playlists" | "my-tracks" | "liked-playlists" | "liked-tracks";

const TABS: { key: Tab; label: string }[] = [
  { key: "my-playlists", label: "My playlists" },
  { key: "my-tracks", label: "My tracks" },
  { key: "liked-playlists", label: "My liked playlists" },
  { key: "liked-tracks", label: "My liked tracks" },
];

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("my-playlists");
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery();

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } =
    useFetchPlaylistsQuery(
      { userId: meResponse?.userId },
      { skip: !meResponse?.userId },
    );

  const { data: tracksResponse } = useFetchTracksInfiniteQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  );

  if (isPlaylistsLoading || isMeLoading) return <h1>Skeleton loader...</h1>;
  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />;

  const tracks = tracksResponse?.pages.flatMap((page) => page.data) || [];
  const tracksCount =
    tracksResponse?.pages[0]?.meta.totalCount ?? tracks.length;

  const renderContent = () => {
    switch (activeTab) {
      case "my-playlists":
        return (
          <PlaylistsList
            isPlaylistsLoading={isPlaylistsLoading || isMeLoading}
            playlists={playlistsResponse?.data || []}
          />
        );
      case "my-tracks":
        return <TracksList tracks={tracks} />;
      case "liked-playlists":
        return <p className={s.empty}>No liked playlists yet</p>;
      case "liked-tracks":
        return <p className={s.empty}>No liked tracks yet</p>;
    }
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.avatar}>{meResponse!.login[0].toUpperCase()}</div>
        <h1 className={s.login}>{meResponse!.login}</h1>
        <div className={s.stats}>
          <div>
            {" "}
            <span className={s.statsNum}>{playlistsResponse?.meta.totalCount ?? 0}</span>{" "}
            <span>playlists</span>{" "}
          </div>
          <div>
            {" "}
            <span className={s.statsNum}>{tracksCount}</span> <span>tracks</span>{" "}
          </div>
          
        </div>
      </div>

      <div className={s.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${s.tab} ${activeTab === tab.key ? s.activeTab : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.content}>{renderContent()}</div>

      <CreatePlaylistForm />
    </div>
  );
};
