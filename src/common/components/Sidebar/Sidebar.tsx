import { Fragment } from "react";
import { Path } from "@/common/routing";
import { NavLink } from "react-router";
import { Icon } from "../Icon/Icon";
import s from "./Sidebar.module.css";

const navItems = [
  { to: Path.Main, label: "Home", iconId: "home" },
  { to: Path.Library, label: "Your Library", iconId: "library" },
  { to: Path.CreatePlaylist, label: "Create Playlist", iconId: "create" },
  { to: Path.UploadTrack, label: "Upload Track", iconId: "upload" },
  { to: Path.Tracks, label: "All Tracks", iconId: "tracks" },
  { to: Path.Playlists, label: "All Playlists", iconId: "playlists" },
];

export const Sidebar = () => {
  return (
    <aside className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item, index) => (
            <Fragment key={item.to}>
              <li>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${s.link} ${isActive ? s.activeLink : ""}`
                  }
                >
                  <Icon iconId={item.iconId} width="26" height="26" viewBox="0 0 32 32" />
                  {item.label}
                </NavLink>
              </li>
              {(index + 1) % 2 === 0 && index !== navItems.length - 1 && (
                <li className={s.divider} />
              )}
            </Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );
};