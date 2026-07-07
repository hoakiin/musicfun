import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TracksListSkeleton } from "@/features/tracks/ui/TracksPage/TracksListSkeleton/TracksListSkeleton";
import s from "./PlaylistPageSkeleton.module.css";

export const PlaylistPageSkeleton = () => {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.coverSection}>
          <Skeleton className={s.cover} />
          <div className={s.actions}>
            <Skeleton circle width={70} height={70} />
            <Skeleton circle width={32} height={32} />
            <Skeleton circle width={32} height={32} />
            <Skeleton width={4} height={24} />
          </div>
        </div>

        <div className={s.info}>
          <div className={s.tags}>
            <Skeleton className={s.tag} />
            <Skeleton className={s.tag} />
            <Skeleton className={s.tag} />
          </div>
          <Skeleton className={s.title} />
          <Skeleton className={s.description} />
          <div className={s.meta}>
            <Skeleton className={s.metaItem} width={120} />
            <Skeleton className={s.metaDot} height={14} />
            <Skeleton className={s.metaItem} width={80} />
            <Skeleton className={s.metaDot} height={14} />
            <Skeleton className={s.metaItem} width={60} />
          </div>
        </div>
      </div>

      <TracksListSkeleton count={8} />
    </div>
  );
};
