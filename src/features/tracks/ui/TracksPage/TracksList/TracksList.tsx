import type { TrackData } from '../../../api/tracksApi.types.ts'
import { TrackCover } from './TrackCover/TrackCover'
import { formatRelativeDate, formatDuration } from '@/common/utils'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/model/store'
import { selectCurrentTrack } from '@/features/player/model/playerSlice'
import { triggerPlay, triggerTogglePlay } from '@/features/player/lib/playController'
import { playerStore } from '@/features/player/lib/playerStore'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
}

export const TracksList = ({ tracks }: Props) => {
  const currentTrack = useAppSelector(selectCurrentTrack)

  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, isPlaying: false })

  useEffect(() => {
    const unsub = playerStore.subscribe(() => {
      setProgress({
        currentTime: playerStore.currentTime,
        duration: playerStore.duration,
        isPlaying: playerStore.isPlaying,
      })
    })
    return unsub
  }, [])

  const handleTrackClick = (track: TrackData) => {
    if (currentTrack?.id === track.id) {
      triggerTogglePlay()
    } else {
      triggerPlay(track)
    }
  }

  return (
    <div className={s.table}>
      <div className={s.header}>
        <span className={s.colNum}>#</span>
        <span className={s.colTitle}>TITLE</span>
        <span />
        <span className={s.colDate}>DATE ADDED</span>
        <span className={s.colTime}>TIME</span>
      </div>

      {tracks.map((track, index) => {
        const { title, user, publishedAt, images, duration: trackDuration } = track.attributes
        const isCurrentTrack = currentTrack?.id === track.id

        return (
          <div
            key={track.id}
            className={`${s.row} ${isCurrentTrack ? s.active : ''}`}
            onClick={() => handleTrackClick(track)}
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
            <span className={s.colTime}>{formatDuration(trackDuration)}</span>
          </div>
        )
      })}
    </div>
  )
}
