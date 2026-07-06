import { useState, useRef } from 'react'
import { Link } from 'react-router'
import type { TrackData } from '../../../../api/tracksApi.types'
import { TrackCover } from '../TrackCover/TrackCover'
import { TrackReactions } from '../TrackReactions/TrackReactions'
import { Icon } from '@/common/components/Icon/Icon'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useClickOutside } from '@/common/hooks'
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
  onEdit: () => void
  onAddToPlaylist: () => void
  playlistId?: string
  onDeleteFromPlaylist?: () => void
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
  onEdit,
  onAddToPlaylist,
  playlistId,
  onDeleteFromPlaylist,
}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, () => setMenuOpen(false))
  const { data: meData } = useGetMeQuery()

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onEdit()
  }

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onAddToPlaylist()
  }

  const handleDeleteFromPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    onDeleteFromPlaylist?.()
  }

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
            <Link to={"/user/" + user.id} className={s.userName} onClick={(e) => e.stopPropagation()}>{user.name}</Link>
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

      <div className={s.colReactions} ref={menuRef}>
        <TrackReactions
          reaction={reaction}
          onLike={onLike}
          onDislike={onDislike}
        />
        <button className={s.menuBtn} onClick={handleMenuClick}>
          &#8230;
        </button>
        {menuOpen && (
          <div className={s.dropdown}>
            {meData?.userId === user.id && (
              <button className={s.dropdownItem} onClick={handleEdit}>
                <Icon iconId="edit" width="26" height="26" viewBox="0 0 32 32" />
                Edit
              </button>
            )}
            <button className={s.dropdownItem} onClick={handleAddToPlaylist}>
              <Icon iconId="add-to-playlist" width="26" height="26" viewBox="0 0 32 32" />
              Add to Playlist
            </button>
            {playlistId && (
              <button className={`${s.dropdownItem} ${s.danger}`} onClick={handleDeleteFromPlaylist}>
                <Icon iconId="delete" width="26" height="26" viewBox="0 0 24 24" />
                Delete from Playlist
              </button>
            )}
          </div>
        )}
      </div>

      <span className={s.colTime}>{formatDuration(trackDuration)}</span>
    </div>
  )
}
