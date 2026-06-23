import type { TrackData } from '../../../../api/tracksApi.types'
import { TrackCover } from '../TrackCover/TrackCover'
import { TrackReactions } from '../TrackReactions/TrackReactions'
import { formatRelativeDate, formatDuration } from '@/common/utils'
import s from './TrackRow.module.css'

type Props = {
  track: TrackData
  index: number
  isCurrentTrack: boolean
  reaction: number
  progress: { currentTime: number; duration: number; isPlaying: boolean }
  onClick: () => void
  onLike: () => void
  onDislike: () => void
}

export const TrackRow = ({
  track,
  index,
  isCurrentTrack,
  reaction,
  progress,
  onClick,
  onLike,
  onDislike,
}: Props) => {
  const { title, user, publishedAt, images, duration: trackDuration } = track.attributes

  return (
    <div
      className={`${s.row} ${isCurrentTrack ? s.active : ''}`}
      onClick={onClick}
    >
      <span className={s.colNum}>
        {isCurrentTrack ? '▶' : index + 1}
      </span>

      <div className={s.colTitle}>
        <TrackCover trackId={track.id} images={images} />
        <div className={s.info}>
          <h3 className={s.title}>{title.length > 25 ? `${title.slice(0, 25)}...` : title}</h3>
          <p className={s.subtitle}>
            <span className={s.userName}>{user.name}</span>
          </p>
        </div>
      </div>

      <div className={s.colProgress}>
        {isCurrentTrack && (
          <div className={s.progressBar}>
            <div
              className={s.progressFill}
              style={{
                width: progress.duration
                  ? `${(progress.currentTime / progress.duration) * 100}%`
                  : '0%',
              }}
            />
          </div>
        )}
      </div>

      <span className={s.colDate}>{formatRelativeDate(publishedAt)}</span>

      <div className={s.colReactions}>
        <TrackReactions
          reaction={reaction}
          likesCount={track.attributes.likesCount}
          onLike={onLike}
          onDislike={onDislike}
        />
      </div>

      <span className={s.colTime}>{formatDuration(trackDuration)}</span>
    </div>
  )
}
