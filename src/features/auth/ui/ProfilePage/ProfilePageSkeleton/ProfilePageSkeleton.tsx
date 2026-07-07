import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PlaylistListSkeleton } from "@/features/playlists/ui/PlaylistsPage/PlaylistListSkeleton/PlaylistListSkeleton";
import s from "./ProfilePageSkeleton.module.css";

export const ProfilePageSkeleton = () => {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <Skeleton circle width={120} height={120} className={s.avatar} />
        <Skeleton className={s.login} />
        <div className={s.stats}>
          <div className={s.statItem}>
            <Skeleton className={s.statNum} />
            <Skeleton className={s.statLabel} />
          </div>
          <div className={s.statItem}>
            <Skeleton className={s.statNum} />
            <Skeleton className={s.statLabel} />
          </div>
        </div>
      </div>

      <div className={s.tabs}>
        <Skeleton className={s.tab} />
        <Skeleton className={s.tab} />
        <Skeleton className={s.tab} />
        <Skeleton className={s.tab} />
      </div>

      <div className={s.content}>
        <Skeleton className={s.createBtn} />
        <PlaylistListSkeleton count={8} />
      </div>
    </div>
  );
};
