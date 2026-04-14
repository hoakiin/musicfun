import { useInfiniteScroll } from "@/common/hooks";
import { useFetchTracksInfiniteQuery } from "../../api/tracksApi";
import { TracksList } from "./TracksList/TracksList";
import { LoadingTrigger } from "./LoadingTrigger/LoadingTrigger";

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useFetchTracksInfiniteQuery();

  const { observerRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  const pages = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div>
      <h1>Tracks page</h1>
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
