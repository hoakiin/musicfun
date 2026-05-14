import type { PlaylistAttributes } from "@/features/playlists/api/playlistsApi.types"
import s from "./PlaylistDescription.module.css"

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={s.container}>
      <h3 className={s.title}>{attributes.title}</h3>
      <p className={s.subtitle}>
        Made for <span className={s.userName}>{attributes.user.name}</span>
      </p>
      <p className={s.stats}>
        {attributes.tracksCount} Tracks · Created at {formatDate(attributes.addedAt)}
      </p>
      <p className={s.likes}>{attributes.likesCount} likes</p>
    </div>
  )
}