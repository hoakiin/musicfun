import { useCreatePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import type { CreatePlaylistFormValues } from "@/features/playlists/api/playlistsApi.types";
import { useForm, type SubmitHandler } from "react-hook-form";

export const CreatePlaylistForm = () => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistFormValues>();

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
      </div>
      <div>
        <input {...register("description")} placeholder={"description"} />
      </div>
      <button type="submit">create playlist</button>
    </form>
  );
};
