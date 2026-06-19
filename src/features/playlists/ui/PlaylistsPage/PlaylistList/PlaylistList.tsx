import type {
  PlaylistListData
} from "@/features/playlists/api/playlistsApi.types";
import { PlaylistItem } from "../PlaylistItem/PlaylistItem";
import s from "./PlaylistList.module.css";

type Props = {
  playlists: PlaylistListData[];
  isPlaylistsLoading: boolean;
};

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
  
  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        return (
          <div className={s.item} key={playlist.id}>
            <PlaylistItem playlist={playlist} />
          </div>
        );
      })}
    </div>
  );
};
