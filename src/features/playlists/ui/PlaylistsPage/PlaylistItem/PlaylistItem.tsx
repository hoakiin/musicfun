import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types";
import { PlaylistCover } from "./PlaylistCover/PlaylistCover";
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription";

type Props = {
  playlist: PlaylistData;
};

export const PlaylistItem = ({
  playlist,
}: Props) => {
  return (
    <div>
      <PlaylistCover
        playlistId={playlist.id}
        images={playlist.attributes.images}
      />
      <PlaylistDescription attributes={playlist.attributes} />
    </div>
  );
};
