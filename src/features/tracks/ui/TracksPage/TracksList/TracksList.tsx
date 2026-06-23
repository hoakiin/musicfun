import type { TrackData } from '../../../api/tracksApi.types'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/model/store'
import { selectCurrentTrack } from '@/features/player/model/playerSlice'
import { triggerPlay, triggerTogglePlay } from '@/features/player/lib/playController'
import { playerStore } from '@/features/player/lib/playerStore'
import { useLikeTrackMutation, useDislikeTrackMutation } from '@/features/tracks/api/tracksApi'
import { CurrentUserReaction } from '@/common/enums'
import { TrackRow } from './TrackRow/TrackRow'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
}

export const TracksList = ({ tracks }: Props) => {
  const currentTrack = useAppSelector(selectCurrentTrack)
  const [likeTrack] = useLikeTrackMutation()
  const [dislikeTrack] = useDislikeTrackMutation()
  const [reactions, setReactions] = useState<Record<string, number>>({})
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

  const handleLike = (trackId: string, initial: number) => {
    const current = reactions[trackId] ?? initial
    const next = current === CurrentUserReaction.Like ? CurrentUserReaction.None : CurrentUserReaction.Like
    setReactions(prev => ({ ...prev, [trackId]: next }))
    likeTrack(trackId)
  }

  const handleDislike = (trackId: string, initial: number) => {
    const current = reactions[trackId] ?? initial
    const next = current === CurrentUserReaction.Dislike ? CurrentUserReaction.None : CurrentUserReaction.Dislike
    setReactions(prev => ({ ...prev, [trackId]: next }))
    dislikeTrack(trackId)
  }

  return (
    <div className={s.table}>
      <div className={s.header}>
        <span className={s.colNum}>#</span>
        <span className={s.colTitle}>TITLE</span>
        <span />
        <span className={s.colDate}>DATE ADDED</span>
        <span />
        <span className={s.colTime}>TIME</span>
      </div>

      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id
        const reaction = reactions[track.id] ?? track.attributes.currentUserReaction

        return (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            isCurrentTrack={isCurrentTrack}
            reaction={reaction}
            progress={progress}
            onClick={() => handleTrackClick(track)}
            onLike={() => handleLike(track.id, track.attributes.currentUserReaction)}
            onDislike={() => handleDislike(track.id, track.attributes.currentUserReaction)}
          />
        )
      })}
    </div>
  )
}
