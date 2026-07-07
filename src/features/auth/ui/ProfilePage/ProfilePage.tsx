import { useState } from "react";
import { Navigate } from "react-router";
import { useGetMeQuery } from "../../api/authApi";
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi";
import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi";
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList";
import { TracksList } from "@/features/tracks/ui/TracksPage/TracksList/TracksList";
import { CreatePlaylistModal } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistModal/CreatePlaylistModal";
import { UploadTrackModal } from "@/features/tracks/ui/UploadTrackModal/UploadTrackModal";
import { ProfilePageSkeleton } from "./ProfilePageSkeleton/ProfilePageSkeleton";
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadTrackOpen, setUploadTrackOpen] = useState(false);
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery();

  const { data: playlistsResponse, isLoading: isPlaylistsLoading, isError: isPlaylistsError } =
    useFetchPlaylistsQuery(
      { userId: meResponse?.userId },
      { skip: !meResponse?.userId },
    );

  const { data: tracksResponse, isError: isTracksError } = useFetchTracksInfiniteQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  );

  const { data: likedPlaylistsResponse, isLoading: isLikedPlaylistsLoading, isError: isLikedPlaylistsError } =
    useFetchPlaylistsQuery(
      { onlyLikedByMe: true },
      { skip: !meResponse?.userId },
    );

  const { data: likedTracksResponse, isError: isLikedTracksError } = useFetchTracksInfiniteQuery(
    { onlyLikedByMe: true },
    { skip: !meResponse?.userId },
  );

  if (isPlaylistsLoading || isMeLoading) return <ProfilePageSkeleton />;
  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />;

  const tracks = tracksResponse?.pages.flatMap((page) => page.data) || [];
  const tracksCount =
    tracksResponse?.pages[0]?.meta.totalCount ?? tracks.length;

  const likedTracks = likedTracksResponse?.pages.flatMap((page) => page.data) || [];

  const renderContent = () => {
    switch (activeTab) {
      case "my-playlists":
        if (isPlaylistsError) return <p className={s.error}>Failed to load playlists</p>;
        return (
          <>
            <button
              className={s.createBtn}
              onClick={() => setCreateModalOpen(true)}
            >
              Create a playlist
            </button>
            <PlaylistsList
              isPlaylistsLoading={isPlaylistsLoading || isMeLoading}
              playlists={playlistsResponse?.data || []}
            />
          </>
        );
      case "my-tracks":
        if (isTracksError) return <p className={s.error}>Failed to load tracks</p>;
        return (
          <>
            <button
              className={s.createBtn}
              onClick={() => setUploadTrackOpen(true)}
            >
              Upload track
            </button>
            <TracksList tracks={tracks} />
          </>
        );
      case "liked-playlists":
        if (isLikedPlaylistsError) return <p className={s.error}>Failed to load liked playlists</p>;
        return (
          <PlaylistsList
            isPlaylistsLoading={isLikedPlaylistsLoading || isMeLoading}
            playlists={likedPlaylistsResponse?.data || []}
          />
        );
      case "liked-tracks":
        if (isLikedTracksError) return <p className={s.error}>Failed to load liked tracks</p>;
        return <TracksList tracks={likedTracks} />;
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

      <CreatePlaylistModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <UploadTrackModal
        open={uploadTrackOpen}
        onClose={() => setUploadTrackOpen(false)}
      />

      
    </div>
  );
};
