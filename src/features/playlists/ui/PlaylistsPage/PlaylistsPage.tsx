import { Pagination } from "@/common/components";
import { useDebounceValue } from "@/common/hooks";
import { useState, type ChangeEvent } from "react";
import {
  useFetchPlaylistsQuery
} from "../../api/playlistsApi";
import { CreatePlaylistForm } from "./CreatePlaylistForm/CreatePlaylistForm";
import { PlaylistsList } from "./PlaylistList/PlaylistList";
import s from "./PlaylistsPage.module.css";

export const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounceValue(search);
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
  };

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder={"Search playlist by title"}
        onChange={(e) => searchPlaylistHandler(e)}
      />
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
