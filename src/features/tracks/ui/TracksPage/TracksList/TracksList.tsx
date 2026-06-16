import type { TrackData } from '../../../api/tracksApi.types.ts'
import { TrackCover } from './TrackCover/TrackCover'
import { formatRelativeDate, formatDuration } from '@/common/utils'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
}

export const TracksList = ({ tracks }: Props) => {
  return (
    <div className={s.table}>
      <div className={s.header}>
        <span className={s.colNum}>#</span>
        <span className={s.colTitle}>TITLE</span>
        <span className={s.colDate}>DATE ADDED</span>
        <span className={s.colTime}>TIME</span>
      </div>

      {tracks.map((track, index) => {
        const { title, user, publishedAt, images, duration } = track.attributes

        return (
          <div key={track.id} className={s.row}>
            <span className={s.colNum}>{index + 1}</span>
            <div className={s.colTitle}>
              <TrackCover trackId={track.id} images={images} />
              <div className={s.info}>
                <h3 className={s.title}>{title.length > 20 ? `${title.slice(0, 25)}...` : title}</h3>
                <p className={s.subtitle}>
                  <span className={s.userName}>{user.name}</span>
                </p>
              </div>
            </div>
            <span className={s.colDate}>{formatRelativeDate(publishedAt)}</span>
            <span className={s.colTime}>{formatDuration(duration)}</span>
          </div>
        )
      })}
    </div>
  )
}
