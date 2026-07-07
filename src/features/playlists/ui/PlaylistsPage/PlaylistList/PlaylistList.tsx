import type {
  PlaylistListData
} from "@/features/playlists/api/playlistsApi.types";
import { PlaylistItem } from "../PlaylistItem/PlaylistItem";
import { PlaylistListSkeleton } from "../PlaylistListSkeleton/PlaylistListSkeleton";
import s from "./PlaylistList.module.css";

type Props = {
  playlists: PlaylistListData[];
  isPlaylistsLoading: boolean;
};

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
  if (isPlaylistsLoading) {
    return <PlaylistListSkeleton count={8} />;
  }

  return (
    <div className={s.items}>
      {!playlists.length && <p className={s.empty}>Playlists not found</p>}
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
