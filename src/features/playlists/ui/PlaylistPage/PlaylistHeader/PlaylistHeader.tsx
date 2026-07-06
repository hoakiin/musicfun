import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import { Icon } from "@/common/components/Icon/Icon";
import { ModalRadix } from "@/common/components/ModalRadix/ModalRadix";
import { CurrentUserReaction } from "@/common/enums";
import {
  useDislikePlaylistMutation,
  useLikePlaylistMutation,
  useDeletePlaylistMutation,
} from "@/features/playlists/api/playlistsApi";
import { useGetMeQuery } from "@/features/auth/api/authApi";
import { useClickOutside } from "@/common/hooks/useClickOutside";
import { EditPlaylistModal } from "@/features/playlists/ui/PlaylistsPage/EditPlaylistModal/EditPlaylistModal";
import { formatDuration } from "@/common/utils";
import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types";
import s from "./PlaylistHeader.module.css";

type Props = {
  playlist: PlaylistData;
  hasTracks: boolean;
  showPause: boolean;
  onPlay: () => void;
};

export const PlaylistHeader = ({
  playlist,
  hasTracks,
  showPause,
  onPlay,
}: Props) => {
  const { attributes } = playlist;
  const navigate = useNavigate();
  const [reaction, setReaction] = useState<number>(
    attributes.currentUserReaction,
  );
  const [likePlaylist] = useLikePlaylistMutation();
  const [dislikePlaylist] = useDislikePlaylistMutation();
  const [deletePlaylist, { isLoading: isDeleting }] =
    useDeletePlaylistMutation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: meData } = useGetMeQuery();

  useClickOutside(
    menuRef,
    useCallback(() => setMenuOpen(false), []),
  );

  const originalCover = attributes.images.main?.find(
    (img) => img.type === "original",
  );
  const coverSrc = originalCover?.url || defaultCover;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReaction((prev) =>
      prev === CurrentUserReaction.Like
        ? CurrentUserReaction.None
        : CurrentUserReaction.Like,
    );
    likePlaylist(playlist.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReaction((prev) =>
      prev === CurrentUserReaction.Dislike
        ? CurrentUserReaction.None
        : CurrentUserReaction.Dislike,
    );
    dislikePlaylist(playlist.id);
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    navigate("/playlists");
  };

  return (
    <div className={s.header}>
      <div className={s.coverSection}>
        <img src={coverSrc} alt={attributes.title} className={s.cover} />
        <div className={s.actions}>
          {hasTracks && (
            <button
              className={`${s.playBtn} ${showPause ? s.playing : ""}`}
              onClick={onPlay}
            >
              <Icon
                iconId={showPause ? "pause" : "play"}
                width="50"
                height="50"
                viewBox="0 0 40 40"
              />
            </button>
          )}

          <div className={s.reactions}>
            <button
              className={`${s.reactionBtn} ${reaction === CurrentUserReaction.Like ? s.liked : ""}`}
              onClick={handleLike}
            >
              <Icon
                iconId={
                  reaction === CurrentUserReaction.Like
                    ? "heart-filled"
                    : "heart-outline"
                }
                width="32"
                height="32"
                viewBox="0 0 28 28"
              />
            </button>
            <button
              className={`${s.reactionBtn} ${reaction === CurrentUserReaction.Dislike ? s.disliked : ""}`}
              onClick={handleDislike}
            >
              <Icon
                iconId={
                  reaction === CurrentUserReaction.Dislike
                    ? "dislike-filled"
                    : "dislike"
                }
                width="32"
                height="32"
                viewBox="0 0 28 28"
              />
            </button>
          </div>

          {meData?.userId === attributes.user.id && (
            <div className={s.menuContainer} ref={menuRef}>
              <button
                className={s.menuBtn}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                &#8942;
              </button>

              {menuOpen && (
                <div className={s.dropdown}>
                  <button
                    className={s.dropdownItem}
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                  >
                    <Icon
                      iconId={"edit"}
                      width="26"
                      height="26"
                      viewBox="0 0 22 20"
                    /> Edit
                  </button>
                  <button
                    className={`${s.dropdownItem} ${s.danger}`}
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                  >
                    <Icon
                      iconId={"delete"}
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                    /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
            Made for <Link to={"/user/" + attributes.user.id} className={s.userName}>{attributes.user.name}</Link>
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

      <EditPlaylistModal
        open={editOpen}
        playlistId={playlist.id}
        onClose={() => setEditOpen(false)}
      />

      <ModalRadix
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        modalTitle="Delete Playlist"
      >
        <p className={s.confirmText}>Do you want to delete this playlist?</p>
        <div className={s.confirmFooter}>
          <button className={s.cancelBtn} onClick={() => setDeleteOpen(false)}>
            No
          </button>
          <button
            className={s.deleteBtn}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </button>
        </div>
      </ModalRadix>
    </div>
  );
};
