import { useDebounceValue, useInfiniteScroll } from "@/common/hooks";
import { useFetchTracksInfiniteQuery } from "../../api/tracksApi";
import { TracksList } from "./TracksList/TracksList";
import { LoadingTrigger } from "./LoadingTrigger/LoadingTrigger";
import s from "./TracksPage.module.css";
import { SearchInput, SortSelect } from "@/common/components";
import { useState, useEffect, type ChangeEvent } from "react";
import { useAppDispatch } from "@/app/model/store";
import { setQueue } from "@/features/player/model/playerSlice";

export const TracksPage = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "top">("newest");
  const debounceSearch = useDebounceValue(search);

  const sortBy = sort === "top" ? "likesCount" : "publishedAt";
  const sortDirection = sort === "oldest" ? "asc" : "desc";

  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useFetchTracksInfiniteQuery({
      search: debounceSearch,
      sortBy,
      sortDirection,
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
