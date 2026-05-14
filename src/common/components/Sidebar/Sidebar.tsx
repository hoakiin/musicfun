import { Path } from "@/common/routing";
import { NavLink } from "react-router";
import s from "./Sidebar.module.css";

const navItems = [
  { to: Path.Main, label: "Home" },
  { to: Path.Library, label: "Your Library" },
  { to: Path.CreatePlaylist, label: "Create Playlist" },
  { to: Path.UploadTrack, label: "Upload Track" },
  { to: Path.Tracks, label: "All Tracks" },
  { to: Path.Playlists, label: "All Playlists" },
];

export const Sidebar = () => {
  return (
    <aside className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${s.link} ${isActive ? s.activeLink : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};