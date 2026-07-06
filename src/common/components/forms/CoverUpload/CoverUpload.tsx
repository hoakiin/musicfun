import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/common/components/Icon/Icon";
import s from "./CoverUpload.module.css";

type Props = {
  currentCover?: string | null;
  onChange?: (file: File | null) => void;
};

export const CoverUpload = ({ currentCover, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentCover) {
      setPreview(currentCover);
    }
  }, [currentCover]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  });

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    onChange?.(file);
  };

  const handleRemove = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange?.(null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <div onClick={handleOpenFilePicker} className={s.uploadBox}>
        {preview ? (
          <img src={preview} alt="preview" className={s.image} />
        ) : (
          <div className={s.icon}>
            <Icon iconId="image" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleOpenFilePicker}
        className={s.uploadButton}
      >
        Upload Cover Image
      </button>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className={s.removeButton}
        >
          Remove cover
        </button>
      )}
    </div>
  );
};
