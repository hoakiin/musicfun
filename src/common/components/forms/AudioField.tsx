import { type Control, Controller, type FieldValues } from "react-hook-form";
import { useRef } from "react";

type Props = {
  control: Control<FieldValues>;
};

export const AudioField = ({ control }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name="audioFile"
      control={control}
      render={({ field }) => (
        <div>
          <button type="button" onClick={() => inputRef.current?.click()}>
            {field.value ? field.value.name : "Choose audio file"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            hidden
            onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
          />
        </div>
      )}
    />
  );
};
