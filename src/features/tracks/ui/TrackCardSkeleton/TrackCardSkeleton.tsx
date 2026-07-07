import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import s from "./TrackCardSkeleton.module.css";

type Props = {
  count?: number;
};

export const TrackCardSkeleton = ({ count = 10 }: Props) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className={s.card} key={index}>
          <div className={s.coverWrapper}>
            <Skeleton className={s.cover} />
          </div>
          <div className={s.body}>
            <Skeleton className={s.title} />
            <Skeleton className={s.authors} />
            <div className={s.reactions}>
              <Skeleton circle width={22} height={22} />
              <Skeleton circle width={22} height={22} />
              <Skeleton className={s.likes} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
