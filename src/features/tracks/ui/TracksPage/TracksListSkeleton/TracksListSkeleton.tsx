import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import s from "./TracksListSkeleton.module.css";

type Props = {
  count?: number;
};

export const TracksListSkeleton = ({ count = 8 }: Props) => {
  return (
    <div className={s.table}>
      <div className={s.header}>
        <span className={s.colNum}>
          <Skeleton circle width={16} height={16} />
        </span>
        <span>TITLE</span>
        <span />
        <span>DATE ADDED</span>
        <span />
        <span>TIME</span>
      </div>

      {Array.from({ length: count }).map((_, index) => (
        <div className={s.row} key={index}>
          <span className={s.colNum}>
            <Skeleton width={16} height={16} />
          </span>

          <div className={s.colTitle}>
            <Skeleton className={s.cover} />
            <div className={s.colInfo}>
              <Skeleton className={s.titleLine} />
              <Skeleton className={s.subtitleLine} />
            </div>
          </div>

          <div />

          <Skeleton className={s.colDate} />

          <div className={s.colReactions}>
            <Skeleton circle width={30} height={30} />
            <Skeleton circle width={30} height={30} />
            <span className={s.menuDots}>
              <Skeleton width={4} height={20} />
            </span>
          </div>

          <Skeleton className={s.colTime} />
        </div>
      ))}
    </div>
  );
};
