import defaultCover from "@/assets/images/default-playlist-cover.png";
import { useParams } from "react-router";
import { useFetchPlaylistQuery } from "../../api/playlistsApi";
import s from "./PlaylistPage.module.css";
import { formatDuration } from "@/common/utils";

export const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data, isLoading } = useFetchPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  if (isLoading || !data) {
    return <h1>Loading...</h1>;
  }

  const { attributes } = data.data;
  const originalCover = attributes.images.main?.find(
    (img) => img.type === "original",
  );
  const coverSrc = originalCover?.url || defaultCover;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <img src={coverSrc} alt={attributes.title} className={s.cover} />

        <div className={s.info}>
          {attributes.tags.length > 0 && (
            <div className={s.tags}>
              {attributes.tags.map((tag) => (
                <span key={tag.id} className={s.tag}>
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <h1 className={s.title}>{attributes.title}</h1>

          {attributes.description && (
            <p className={s.description}>{attributes.description}</p>
          )}

          <div className={s.meta}>
            <span>
              Made for{" "}
              <span className={s.userName}>{attributes.user.name}</span>
            </span>
            <span className={s.dot}>&middot;</span>
            <span>
              {attributes.tracksCount}{" "}
              {attributes.tracksCount === 1 ? "track" : "tracks"}
            </span>
            <span className={s.dot}>&middot;</span>
            <span>{formatDuration(attributes.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
