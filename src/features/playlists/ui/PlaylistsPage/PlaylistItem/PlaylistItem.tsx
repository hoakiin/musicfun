import { Link } from "react-router";
import type { PlaylistListData } from "@/features/playlists/api/playlistsApi.types";
import { PlaylistCover } from "./PlaylistCover/PlaylistCover";
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription";

type Props = {
  playlist: PlaylistListData;
};

export const PlaylistItem = ({
  playlist,
}: Props) => {
  return (
    <Link to={`/playlists/${playlist.id}`}>
      <PlaylistCover images={playlist.attributes.images} />
      <PlaylistDescription id={playlist.id} attributes={playlist.attributes} />
    </Link>
  );
};
