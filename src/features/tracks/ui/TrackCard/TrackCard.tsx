import { Icon } from "@/common/components/Icon/Icon";
import { CurrentUserReaction } from "@/common/enums";
import {
  useLikeTrackMutation,
  useDislikeTrackMutation,
} from "@/features/tracks/api/tracksApi";
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import { useState } from "react";
import s from "./TrackCard.module.css";

type Props = {
  track: TrackData;
  included: TracksIncluded[];
};

export const TrackCard = ({ track, included }: Props) => {
  const [reaction, setReaction] = useState<number>(
    track.attributes.currentUserReaction,
  );
  const [likeTrack] = useLikeTrackMutation();
  const [dislikeTrack] = useDislikeTrackMutation();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReaction((prev) =>
      prev === CurrentUserReaction.Like
        ? CurrentUserReaction.None
        : CurrentUserReaction.Like,
    );
    likeTrack(track.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReaction((prev) =>
      prev === CurrentUserReaction.Dislike
        ? CurrentUserReaction.None
        : CurrentUserReaction.Dislike,
    );
    dislikeTrack(track.id);
  };

  const originalCover = track.attributes.images.main?.find(
    (img) => img.type === "original",
  );
  const src = originalCover?.url || defaultCover;

  const artistNames = track.relationships.artists.data
    .map((ref) => included.find((inc) => inc.id === ref.id))
    .filter(Boolean)
    .map((artist) => artist!.attributes.name)
    .join(", ");

  return (
    <div className={s.card}>
      <div className={s.coverWrapper}>
        <img src={src} alt={track.attributes.title} className={s.cover} />
      </div>
      <div className={s.body}>
        <h4 className={s.title}>{track.attributes.title}</h4>
        <p className={s.authors}>{artistNames}</p>
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
              width="22"
              height="22"
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
              width="22"
              height="22"
              viewBox="0 0 28 28"
            />
          </span>
          
        </div>
        <p className={s.likesCount}>{track.attributes.likesCount} likes</p>
      </div>
    </div>
  );
};
