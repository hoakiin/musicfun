import { type Control, Controller, type FieldValues } from "react-hook-form";
import { TagSelect } from "@/common/components";
import type { Tag } from "@/common/types";

type Props = {
  control: Control<FieldValues>;
};

export const TagsField = ({ control }: Props) => (
  <Controller
    name="tags"
    control={control}
    render={({ field }) => (
      <TagSelect
        selectedTags={(field.value as Tag[]) ?? []}
        onChange={field.onChange}
      />
    )}
  />
);
