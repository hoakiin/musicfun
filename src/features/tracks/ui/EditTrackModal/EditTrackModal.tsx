import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ModalRadix } from "@/common/components/ModalRadix/ModalRadix";
import { CoverUpload, TextField, TagInput } from "@/common/components/forms";
import { useUploadTrackCoverMutation, useDeleteTrackCoverMutation } from "../../api/tracksApi";
import type { TrackData } from "../../api/tracksApi.types";
import s from "./EditTrackModal.module.css";

type Props = {
  open: boolean;
  track: TrackData | null;
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  playlistId: string;
  cover?: File;
};

export const EditTrackModal = ({ open, track, onClose }: Props) => {
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [uploadTrackCover, { isLoading: isUploadingCover }] = useUploadTrackCoverMutation();
  const [deleteTrackCover] = useDeleteTrackCoverMutation();

  const currentCover = track?.attributes.images?.main?.[0]?.url;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      playlistId: "",
    },
  });

  useEffect(() => {
    if (track) {
      reset({
        title: track.attributes.title,
        description: "",
        playlistId: "",
      });
    }
  }, [track, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!track) return;

    const promises: Promise<unknown>[] = [];

    if (data.cover) {
      promises.push(
        currentCover
          ? deleteTrackCover({ trackId: track.id }).unwrap()
          : Promise.resolve()
      );
      promises.push(
        uploadTrackCover({ trackId: track.id, file: data.cover }).unwrap()
      );
    } else if (currentCover) {
      promises.push(
        deleteTrackCover({ trackId: track.id }).unwrap()
      );
    }

    Promise.all(promises).then(() => {
      reset();
      setTagNames([]);
      onClose();
    });
  };

  const handleClose = () => {
    reset();
    setTagNames([]);
    onClose();
  };

  return (
    <ModalRadix open={open} onClose={handleClose} modalTitle="Edit Track">
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
          <span className={s.label}>Playlist</span>
          <select {...register("playlistId")} className={s.select}>
            <option value="">Select playlist</option>
            <option value="1">Rock</option>
            <option value="2">Chill</option>
          </select>
        </div>

        <div className={s.fieldGroup}>
          <span className={s.label}>Hashtags</span>
          <TagInput tags={tagNames} onChange={setTagNames} />
        </div>

        <div className={s.footer}>
          <button type="button" className={s.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={s.saveBtn} disabled={isUploadingCover}>
            {isUploadingCover ? "Uploading..." : "Save"}
          </button>
        </div>
      </form>
    </ModalRadix>
  );
};
