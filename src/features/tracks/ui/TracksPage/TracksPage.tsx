import { useDebounceValue, useInfiniteScroll } from "@/common/hooks";
import { useFetchTracksInfiniteQuery } from "../../api/tracksApi";
import { TracksList } from "./TracksList/TracksList";
import { LoadingTrigger } from "./LoadingTrigger/LoadingTrigger";
import s from "./TracksPage.module.css";
import { SearchInput, SortSelect, TagSelect, ArtistSelect } from "@/common/components";
import { useState, useEffect, type ChangeEvent } from "react";
import { useAppDispatch } from "@/app/model/store";
import { setQueue } from "@/features/player/model/playerSlice";
import type { Tag } from "@/common/types";
import type { ArtistRef } from "@/features/artists/model/artists.schemas";

export const TracksPage = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "top">("newest");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<ArtistRef[]>([]);
  const debounceSearch = useDebounceValue(search);

  const sortBy = sort === "top" ? "likesCount" : "publishedAt";
  const sortDirection = sort === "oldest" ? "asc" : "desc";

  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useFetchTracksInfiniteQuery({
      search: debounceSearch,
      sortBy,
      sortDirection,
      tagsIds: selectedTags.map((t) => t.id),
      artistsIds: selectedArtists.map((a) => a.id),
    });

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const { observerRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  const pages = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    dispatch(setQueue(pages));
  }, [dispatch, pages]);

  return (
    <div className={s.container}>
      <h1 className={s.title}>All Tracks</h1>

      <div className={s.search}>
        <div className={s.inputWrapper}>
          <SearchInput
            value={search}
            placeholder={"Search tracks"}
            onChange={searchPlaylistHandler}
          />
        </div>

        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className={s.filters}>
        <label className={s.filterGroup}>
          <span className={s.label}>Hashtags</span>
          <TagSelect selectedTags={selectedTags} onChange={setSelectedTags} />
        </label>
        <label className={s.filterGroup}>
          <span className={s.label}>Artists</span>
          <ArtistSelect selectedArtists={selectedArtists} onChange={setSelectedArtists} />
        </label>
      </div>

      <TracksList tracks={pages} />

      {hasNextPage && (
        <LoadingTrigger
          isFetchingNextPage={isFetchingNextPage}
          observerRef={observerRef}
        />
      )}

      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  );
};
