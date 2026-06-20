import { Icon } from "@/common/components/Icon/Icon";
import { CurrentUserReaction } from "@/common/enums";
import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
} from "@/features/playlists/api/playlistsApi";
import type { PlaylistListAttributes } from "@/features/playlists/api/playlistsApi.types";
import { useState } from "react";
import s from "./PlaylistDescription.module.css";
import { formatRelativeDate } from "@/common/utils";

type Props = {
  id: string;
  attributes: PlaylistListAttributes;
};

export const PlaylistDescription = ({ id, attributes }: Props) => {
  const [reaction, setReaction] = useState<number>(
    attributes.currentUserReaction,
  );
  const [likePlaylist] = useLikePlaylistMutation();
  const [dislikePlaylist] = useDislikePlaylistMutation();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReaction((prev) =>
      prev === CurrentUserReaction.Like
        ? CurrentUserReaction.None
        : CurrentUserReaction.Like,
    );
    likePlaylist(id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReaction((prev) =>
      prev === CurrentUserReaction.Dislike
        ? CurrentUserReaction.None
        : CurrentUserReaction.Dislike,
    );
    dislikePlaylist(id);
  };

  return (
    <div className={s.container}>
      <h3 className={s.title}>{attributes.title}</h3>
      <p className={s.subtitle}>
        Made for <span className={s.userName}>{attributes.user.name}</span>
      </p>
      <p className={s.stats}>
        {attributes.tracksCount} Tracks · Created{" "}
        {formatRelativeDate(attributes.addedAt)}
      </p>
      <div className={s.reactions}>
        <span
          className={`${s.reactionBtn} ${reaction === CurrentUserReaction.Like ? s.active : ""}`}
          onClick={handleLike}
        >
          <Icon
            iconId={
              reaction === CurrentUserReaction.Like
                ? "heart-filled"
                : "heart-outline"
            }
            width="28"
            height="28"
            viewBox="0 0 28 28"
          />
        </span>
        <span className={s.reactionBtn} onClick={handleDislike}>
          <Icon
            iconId={
              reaction === CurrentUserReaction.Dislike
                ? "dislike-filled"
                : "dislike"
            }
            width="28"
            height="28"
            viewBox="0 0 28 28"
          />
        </span>
      </div>
      <p className={s.likes}>{attributes.likesCount} likes</p>
    </div>
  );
};
