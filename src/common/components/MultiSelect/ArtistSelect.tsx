import { useState } from "react";
import { useSearchArtistsQuery } from "@/features/artists/api/artistsApi";
import { useDebounceValue } from "@/common/hooks/useDebounceValue";
import type { ArtistRef } from "@/features/artists/model/artists.schemas";
import { MultiSelect } from "./MultiSelect";

type Props = {
  selectedArtists: ArtistRef[];
  onChange: (artists: ArtistRef[]) => void;
};

export const ArtistSelect = ({ selectedArtists, onChange }: Props) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 400);

  const { data: artists = [], isLoading } = useSearchArtistsQuery({
    search: debouncedSearch,
  });

  return (
    <MultiSelect<ArtistRef>
      selectedItems={selectedArtists}
      onChange={onChange}
      items={artists}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search artists..."
    />
  );
};
