import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRadix } from "@/common/components/ModalRadix/ModalRadix";
import { useAppDispatch } from "@/app/model/store";
import {
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
} from "@/features/playlists/api/playlistsApi";
import { tagsApi } from "@/features/tags/api/tagsApi";
import { createPlaylistSchema } from "@/features/playlists/model/playlists.schemas";
import { CoverUpload, TextField, TagInput } from "@/common/components/forms";
import s from "./CreatePlaylistModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  cover?: File;
};

export const CreatePlaylistModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [tagNames, setTagNames] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      createPlaylistSchema.pick({ title: true, description: true }).passthrough(),
    ),
    defaultValues: { title: "", description: "" },
  });

  const [createPlaylist] = useCreatePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { cover, ...playlistData } = data;

    try {
      const playlist = await createPlaylist(playlistData).unwrap();
      const playlistId = playlist.data.id;

      if (tagNames.length > 0) {
        const tagIds: string[] = [];

        for (const name of tagNames) {
          const searchResult = await dispatch(
            tagsApi.endpoints.searchTags.initiate({ search: name }),
          ).unwrap();

          const existing = searchResult.find((t) => t.name === name);

          if (existing) {
            tagIds.push(existing.id);
          } else {
            const newTag = await dispatch(
              tagsApi.endpoints.createTag.initiate({
                data: { type: "tags", attributes: { name } },
              }),
            ).unwrap();
            tagIds.push(newTag.data.id);
          }
        }

        await updatePlaylist({ playlistId, body: { ...playlistData, tagIds } }).unwrap();
      }

      if (cover) {
        await uploadPlaylistCover({ playlistId, file: cover }).unwrap();
      }

      reset();
      setTagNames([]);
      onClose();
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <ModalRadix open={open} onClose={onClose} modalTitle="Create Playlist">
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="cover"
          control={control}
          render={({ field }) => (
            <CoverUpload onChange={(file) => field.onChange(file)} />
          )}
        />

        <TextField
          registration={register("title")}
          label="Title"
          placeholder="Title"
          error={errors.title?.message}
        />

        <TextField
          registration={register("description")}
          label="Description"
          placeholder="Description"
          error={errors.description?.message}
        />

        <div className={s.fieldGroup}>
          <span className={s.label}>Hashtags</span>
          <TagInput tags={tagNames} onChange={setTagNames} />
        </div>

        <div className={s.footer}>
          <button type="button" className={s.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={s.saveBtn}>
            Create
          </button>
        </div>
      </form>
    </ModalRadix>
  );
};
