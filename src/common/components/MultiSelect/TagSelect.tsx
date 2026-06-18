import { useState } from "react";
import type { Tag } from "@/common/types";
import { useSearchTagsQuery } from "@/features/tags/api/tagsApi";
import { useDebounceValue } from "@/common/hooks/useDebounceValue";
import { MultiSelect } from "./MultiSelect";

type Props = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

export const TagSelect = ({ selectedTags, onChange }: Props) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 400);

  const { data: tags = [], isLoading } = useSearchTagsQuery({
    search: debouncedSearch,
  });

  return (
    <MultiSelect<Tag>
      selectedItems={selectedTags}
      onChange={onChange}
      items={tags}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by hashtags"
      formatChip={(tag) => `#${tag.name}`}
      formatItem={(tag) => `#${tag.name}`}
    />
  );
};
