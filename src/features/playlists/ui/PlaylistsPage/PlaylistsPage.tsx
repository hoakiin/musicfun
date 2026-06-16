import { Pagination, SearchInput, SortSelect } from "@/common/components";
import { useDebounceValue } from "@/common/hooks";
import { useState, type ChangeEvent } from "react";
import { useFetchPlaylistsQuery } from "../../api/playlistsApi";
import { PlaylistsList } from "./PlaylistList/PlaylistList";
import s from "./PlaylistsPage.module.css";

export const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "top">("newest");
  const debounceSearch = useDebounceValue(search);
  const sortBy = sort === "top" ? "likesCount" : "addedAt";
  const sortDirection = sort === "oldest" ? "asc" : "desc";
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
    sortBy,
    sortDirection,
  });

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
  };

  const sortHandler = (value: "newest" | "oldest" | "top") => {
    setSort(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <h1>Skeleton loader...</h1>;
  }

  return (
    <div className={s.container}>
      <h1 className={s.title}>All Playlists</h1>
      <div className={s.search}>
        <div className={s.inputWrapper}>
          <SearchInput
            value={search}
            placeholder={"Search playlist"}
            onChange={searchPlaylistHandler}
          />
        </div>

        <SortSelect value={sort} onChange={sortHandler} />
      </div>
      
      <PlaylistsList
        isPlaylistsLoading={isLoading}
        playlists={data?.data || []}
      />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  );
};
