import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ModalRadix } from "@/common/components/ModalRadix/ModalRadix";
import { useAppDispatch } from "@/app/model/store";
import {
  useFetchPlaylistQuery,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} from "@/features/playlists/api/playlistsApi";
import { tagsApi } from "@/features/tags/api/tagsApi";
import { CoverUpload, TextField, TagInput } from "@/common/components/forms";
import s from "./EditPlaylistModal.module.css";

type Props = {
  open: boolean;
  playlistId: string;
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  cover?: File;
};

export const EditPlaylistModal = ({ open, playlistId, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { data } = useFetchPlaylistQuery(playlistId, { skip: !open });
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation();
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation();
  const [modifiedTags, setModifiedTags] = useState<string[] | null>(null);

  const existingTags = data?.data.attributes.tags ?? [];

  const displayTags =
    modifiedTags ??
    existingTags.map((t) => t.name) ??
    [];

  const currentCover = data?.data.attributes.images?.main?.[0]?.url;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.data.attributes.title,
        description: data.data.attributes.description,
      });
    }
  }, [data, reset]);

  const resolveTagIds = async (tagNames: string[]): Promise<string[]> => {
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

    return tagIds;
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const { cover, ...body } = formData;

    try {
      let tagIds: string[];

      if (modifiedTags === null) {
        tagIds = existingTags.map((t) => t.id);
      } else {
        tagIds = await resolveTagIds(modifiedTags);
      }

      await updatePlaylist({ playlistId, body: { ...body, tagIds } }).unwrap();

      if (cover) {
        await uploadPlaylistCover({ playlistId, file: cover }).unwrap();
      } else if (currentCover) {
        await deletePlaylistCover({ playlistId }).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  return (
    <ModalRadix open={open} onClose={onClose} modalTitle="Edit Playlist">
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="cover"
          control={control}
          render={({ field }) => (
            <CoverUpload
              currentCover={currentCover}
              onChange={(file) => field.onChange(file)}
            />
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
          <TagInput tags={displayTags} onChange={setModifiedTags} />
        </div>

        <div className={s.footer}>
          <button type="button" className={s.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={s.saveBtn}>
            Save
          </button>
        </div>
      </form>
    </ModalRadix>
  );
};
