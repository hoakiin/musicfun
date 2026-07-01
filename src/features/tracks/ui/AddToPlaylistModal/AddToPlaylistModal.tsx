import { useState, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { PlaylistListData } from '@/features/playlists/api/playlistsApi.types'
import s from './AddToPlaylistModal.module.css'

type Props = {
  open: boolean
  playlists: PlaylistListData[]
  onClose: () => void
  onAdd: (playlistId: string) => void
}

export const AddToPlaylistModal = ({ open, playlists, onClose, onAdd }: Props) => {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return playlists
    const q = search.toLowerCase()
    return playlists.filter((pl) => pl.attributes.title.toLowerCase().includes(q))
  }, [playlists, search])

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? '' : id))
  }

  const handleAdd = () => {
    if (!selectedId) return
    onAdd(selectedId)
  }

  const handleClose = () => {
    setSearch('')
    setSelectedId('')
    onClose()
  }

  const getCoverUrl = (pl: PlaylistListData) => {
    const original = pl.attributes.images.main?.find((img) => img.type === 'original')
    return original?.url ?? defaultCover
  }

  const tracksLabel = (count: number) => {
    if (count === 1) return '1 Track'
    return `${count} Tracks`
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content className={s.content}>
          <div className={s.header}>
            <Dialog.Title className={s.title}>Choose playlist</Dialog.Title>
            <Dialog.Close asChild>
              <button className={s.closeBtn} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <div className={s.searchWrapper}>
            <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.868-3.834zm-5.44.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
            </svg>
            <input
              type="text"
              className={s.searchInput}
              placeholder="Search playlist"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={s.grid}>
            {filtered.map((pl) => {
              const isSelected = selectedId === pl.id
              return (
                <div
                  key={pl.id}
                  className={`${s.card} ${isSelected ? s.selected : ''}`}
                  onClick={() => handleSelect(pl.id)}
                >
                  <div className={s.cover}>
                    <img src={getCoverUrl(pl)} alt={pl.attributes.title} />
                  </div>
                  <span className={s.cardTitle}>{pl.attributes.title}</span>
                  <span className={s.tracksCount}>{tracksLabel(pl.attributes.tracksCount)}</span>
                </div>
              )
            })}
          </div>

          <div className={s.footer}>
            <button className={s.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button
              className={s.addBtn}
              disabled={!selectedId}
              onClick={handleAdd}
            >
              Add to playlist
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
