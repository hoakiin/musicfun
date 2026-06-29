import { type Control, Controller, type FieldValues } from "react-hook-form";
import { useRef } from "react";
import s from "./CoverField.module.css";

type Props = {
  control: Control<FieldValues>;
};

export const CoverField = ({ control }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name="cover"
      control={control}
      render={({ field }) => (
        <div>
          <div
            className={s.preview}
            onClick={() => inputRef.current?.click()}
          >
            {field.value ? (
              <img
                src={URL.createObjectURL(field.value)}
                alt="cover"
                className={s.image}
              />
            ) : (
              <span className={s.placeholder}>+</span>
            )}
          </div>

          <button
            type="button"
            className={s.uploadBtn}
            onClick={() => inputRef.current?.click()}
          >
            {field.value ? "Change cover" : "Upload cover"}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
          />
        </div>
      )}
    />
  );
};
