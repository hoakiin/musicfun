import type { TrackData } from '../../../api/tracksApi.types'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/model/store'
import { selectCurrentTrack } from '@/features/player/model/playerSlice'
import { triggerPlay, triggerTogglePlay } from '@/features/player/lib/playController'
import { playerStore } from '@/features/player/lib/playerStore'
import {
  useLikeTrackMutation,
  useDislikeTrackMutation,
  useAddTrackToPlaylistMutation,
  useDeleteTrackMutation,
} from '@/features/tracks/api/tracksApi'
import { CurrentUserReaction } from '@/common/enums'
import { TrackRow } from './TrackRow/TrackRow'
import { EditTrackModal } from '../../EditTrackModal/EditTrackModal'
import { AddToPlaylistModal } from '../../AddToPlaylistModal/AddToPlaylistModal'
import { useFetchPlaylistsQuery, useUnbindTrackFromPlaylistMutation } from '@/features/playlists/api/playlistsApi'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
  playlistId?: string
}

export const TracksList = ({ tracks, playlistId }: Props) => {
  const currentTrack = useAppSelector(selectCurrentTrack)
  const [likeTrack] = useLikeTrackMutation()
  const [dislikeTrack] = useDislikeTrackMutation()
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [unbindTrackFromPlaylist] = useUnbindTrackFromPlaylistMutation()
  const [deleteTrack] = useDeleteTrackMutation()
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [_likesCounts, setLikesCounts] = useState<Record<string, number>>({})
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, isPlaying: false })

  const [trackToEdit, setTrackToEdit] = useState<TrackData | null>(null)
  const [trackToAdd, setTrackToAdd] = useState<TrackData | null>(null)

  const { data: meData } = useGetMeQuery()
  const { data: playlistsResponse } = useFetchPlaylistsQuery(
    { userId: meData?.userId, pageSize: 20 },
    { skip: !meData?.userId },
  )
  const playlists = playlistsResponse?.data ?? []

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
    likeTrack(trackId).unwrap().then((res) => {
      setLikesCounts(prev => ({ ...prev, [trackId]: res.likes }))
    }).catch(() => {
      setReactions(prev => ({ ...prev, [trackId]: current }))
    })
  }

  const handleDislike = (trackId: string, initial: number) => {
    const current = reactions[trackId] ?? initial
    const next = current === CurrentUserReaction.Dislike ? CurrentUserReaction.None : CurrentUserReaction.Dislike
    setReactions(prev => ({ ...prev, [trackId]: next }))
    dislikeTrack(trackId).unwrap().then((res) => {
      setLikesCounts(prev => ({ ...prev, [trackId]: res.likes }))
    }).catch(() => {
      setReactions(prev => ({ ...prev, [trackId]: current }))
    })
  }

  const handleEdit = (track: TrackData) => {
    setTrackToEdit(track)
  }

  const handleStartAddToPlaylist = (track: TrackData) => {
    setTrackToAdd(track)
  }

  const handleConfirmAddToPlaylist = (playlistId: string) => {
    if (!trackToAdd) return
    addTrackToPlaylist({ playlistId, trackId: trackToAdd.id })
    setTrackToAdd(null)
  }

  const handleCloseAddModal = () => {
    setTrackToAdd(null)
  }

  const handleDeleteFromPlaylist = (trackId: string) => {
    if (!playlistId) return
    unbindTrackFromPlaylist({ playlistId, trackId })
  }

  const handleDelete = (trackId: string) => {
    deleteTrack({ trackId })
  }

  return (
    <>
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
              onEdit={() => handleEdit(track)}
              onAddToPlaylist={() => handleStartAddToPlaylist(track)}
              onDelete={() => handleDelete(track.id)}
              playlistId={playlistId}
              onDeleteFromPlaylist={() => handleDeleteFromPlaylist(track.id)}
            />
          )
        })}
      </div>

      <EditTrackModal
        open={!!trackToEdit}
        track={trackToEdit}
        onClose={() => setTrackToEdit(null)}
      />

      <AddToPlaylistModal
        open={!!trackToAdd}
        playlists={playlists}
        onClose={handleCloseAddModal}
        onAdd={handleConfirmAddToPlaylist}
      />
    </>
  )
}
