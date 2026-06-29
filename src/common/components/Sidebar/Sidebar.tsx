import { Fragment, useState } from "react";
import { Path } from "@/common/routing";
import { NavLink } from "react-router";
import { Icon } from "../Icon/Icon";
import { CreatePlaylistModal } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistModal/CreatePlaylistModal";
import { UploadTrackModal } from "@/features/tracks/ui/UploadTrackModal/UploadTrackModal";
import s from "./Sidebar.module.css";

export const Sidebar = () => {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [uploadTrackOpen, setUploadTrackOpen] = useState(false);

  const navItems = [
    { to: Path.Main, label: "Home", iconId: "home" },
    { to: Path.Library, label: "Your Library", iconId: "library" },
    { to: null, label: "Create Playlist", iconId: "create", onClick: () => setCreatePlaylistOpen(true) },
    { to: null, label: "Upload Track", iconId: "upload", onClick: () => setUploadTrackOpen(true) },
    { to: Path.Tracks, label: "All Tracks", iconId: "tracks" },
    { to: Path.Playlists, label: "All Playlists", iconId: "playlists" },
  ];

  return (
    <aside className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item, index) => (
            <Fragment key={item.label}>
              <li>
                {item.to ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${s.link} ${isActive ? s.activeLink : ""}`
                    }
                  >
                    <Icon iconId={item.iconId} width="26" height="26" viewBox="0 0 32 32" />
                    {item.label}
                  </NavLink>
                ) : (
                  <button
                    className={`${s.link} ${s.actionBtn}`}
                    onClick={item.onClick}
                  >
                    <Icon iconId={item.iconId} width="26" height="26" viewBox="0 0 32 32" />
                    {item.label}
                  </button>
                )}
              </li>
              {(index + 1) % 2 === 0 && index !== navItems.length - 1 && (
                <li className={s.divider} />
              )}
            </Fragment>
          ))}
        </ul>
      </nav>

      <CreatePlaylistModal
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
      />
      <UploadTrackModal
        open={uploadTrackOpen}
        onClose={() => setUploadTrackOpen(false)}
      />
    </aside>
  );
};
