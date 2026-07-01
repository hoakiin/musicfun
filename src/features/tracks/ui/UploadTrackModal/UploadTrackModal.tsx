import { useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ModalRadix } from "@/common/components/ModalRadix/ModalRadix";
import { CoverUpload, TextField, TagInput } from "@/common/components/forms";
import { useGetMeQuery } from "@/features/auth/api/authApi";
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi";
import { useUploadTrackMutation, useUploadTrackCoverMutation, useAddTrackToPlaylistMutation, usePublishTrackMutation } from "../../api/tracksApi";
import s from "./UploadTrackModal.module.css";

const MAX_FILE_SIZE = 1_000_000;

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  playlistId: string;
  cover?: File;
};

type Step = "upload" | "details";

export const UploadTrackModal = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<Step>("upload");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [uploadTrack, { isLoading: isUploading }] = useUploadTrackMutation();
  const [uploadTrackCover] = useUploadTrackCoverMutation();
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation();
  const [publishTrack] = usePublishTrackMutation();
  const { data: meResponse } = useGetMeQuery();
  const { data: playlistsResponse } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId, pageSize: 20 },
    { skip: !meResponse?.userId },
  );
  const playlists = playlistsResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      playlistId: "",
    },
  });

  const titleValue = watch("title");
  const isSaveDisabled = useMemo(
    () => isUploading || !titleValue.trim() || !audioFile || !!fileError,
    [isUploading, titleValue, audioFile, fileError],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File size must not exceed 1 MB");
        setAudioFile(null);
        return;
      }
      if (file.type !== "audio/mpeg") {
        setFileError("Only MP3 files are allowed");
        setAudioFile(null);
        return;
      }
    }

    setAudioFile(file);
  };

  const handleNext = () => {
    if (audioFile) {
      setStep("details");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!audioFile) return;

    uploadTrack({ title: data.title, file: audioFile })
      .unwrap()
      .then((response) => {
        const trackId = response.data.id;
        const chain: Promise<unknown>[] = [publishTrack(trackId).unwrap()];

        if (data.cover) {
          chain.push(
            uploadTrackCover({ trackId, file: data.cover }).unwrap()
          );
        }

        if (data.playlistId) {
          chain.push(
            addTrackToPlaylist({ playlistId: data.playlistId, trackId }).unwrap()
          );
        }

        return Promise.all(chain);
      })
      .then(() => {
        reset();
        setTagNames([]);
        setAudioFile(null);
        setStep("upload");
        onClose();
      })
      .catch(() => {
        onClose();
      });
  };

  const handleClose = () => {
    reset();
    setTagNames([]);
    setAudioFile(null);
    setFileError(null);
    setStep("upload");
    onClose();
  };

  return (
    <ModalRadix
      open={open}
      onClose={handleClose}
      modalTitle={step === "upload" ? "Upload Track" : "Track Details"}
      size={step === "upload" ? "small" : "default"}
    >
      {step === "upload" && (
        <div className={s.uploadStep}>
          <div className={s.uploadBody}>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              id="audio-upload"
              className={s.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="audio-upload" className={s.uploadBtn}>
              {audioFile ? audioFile.name : "Choose audio file"}
            </label>
            {fileError && <p className={s.error}>{fileError}</p>}
            <button
              className={s.nextBtn}
              onClick={handleNext}
              disabled={!audioFile}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
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
            <span className={s.label}>Playlist</span>
            <select {...register("playlistId")} className={s.select}>
              <option value="">Select playlist</option>
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.attributes.title}
                </option>
              ))}
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
            <button type="submit" className={s.saveBtn} disabled={isSaveDisabled}>
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </ModalRadix>
  );
};
