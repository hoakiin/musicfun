import { useCreatePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import type { CreatePlaylistFormValues } from "@/features/playlists/api/playlistsApi.types";
import { useForm, type SubmitHandler } from "react-hook-form";
import s from './CreatePlaylistForm.module.css'
import { createPlaylistSchema } from "@/features/playlists/model/playlists.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistFormValues>({
    resolver: zodResolver(createPlaylistSchema),
  });

  const [createPlaylist] = useCreatePlaylistMutation();

  const onSubmit: SubmitHandler<CreatePlaylistFormValues> = (data) => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register("title")} placeholder={"title"} />
        {errors.title && (
          <span className={s.error}>{errors.title.message}</span>
        )}
      </div>
      <div>
        <input {...register("description")} placeholder={"description"} />
        {errors.description && (
          <span className={s.error}>{errors.description.message}</span>
        )}
      </div>
      <button>create playlist</button>
    </form>
  );
};
