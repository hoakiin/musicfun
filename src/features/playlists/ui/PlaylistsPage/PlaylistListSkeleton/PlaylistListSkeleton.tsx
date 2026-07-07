import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import s from "./PlaylistListSkeleton.module.css";

type Props = {
  count?: number;
};

export const PlaylistListSkeleton = ({ count = 8 }: Props) => {
  return (
    <div className={s.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={s.card} key={index}>
          <Skeleton className={s.cover} />
          <div className={s.body}>
            <Skeleton className={s.title} />
            <Skeleton className={s.subtitle} />
            <Skeleton className={s.stats} />
            <div className={s.reactions}>
              <Skeleton circle width={28} height={28} />
              <Skeleton circle width={28} height={28} />
            </div>
            <Skeleton className={s.likes} />
          </div>
        </div>
      ))}
    </div>
  );
};
