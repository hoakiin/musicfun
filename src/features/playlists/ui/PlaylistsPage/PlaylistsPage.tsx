import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
} from "../../api/playlistsApi";
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from "../../api/playlistsApi.types";
import { CreatePlaylistForm } from "./CreatePlaylistForm/CreatePlaylistForm";
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm";
import { PlaylistItem } from "./PlaylistItem/PlaylistItem";
import s from "./PlaylistsPage.module.css";
import { useDebounceValue } from "@/common/hooks";

export const PlaylistsPage = () => {
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounceValue(search);
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
  });

  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [deletePlaylist] = useDeletePlaylistMutation();
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) {
      deletePlaylist(playlistId);
    }
  };

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id);
      reset({
        description: playlist.attributes.description,
        title: playlist.attributes.title,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      });
    } else {
      setPlaylistId(null);
    }
  };

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder={"Search playlist by title"}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <div className={s.items}>
        {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
        {data?.data.map((playlist) => {
          const isEditing = playlist.id === playlistId;

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlist.id}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                  register={register}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  deletePlaylistHandler={deletePlaylistHandler}
                  editPlaylistHandler={editPlaylistHandler}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
