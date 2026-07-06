import { CurrentUserReaction } from '@/common/enums'
import { Icon } from '@/common/components/Icon/Icon'
import s from './TrackReactions.module.css'

type Props = {
  reaction: number
  onLike: () => void
  onDislike: () => void
}

export const TrackReactions = ({ reaction, onLike, onDislike }: Props) => (
  <div className={s.container}>
    <div
      className={`${s.btn} ${reaction === CurrentUserReaction.Like ? s.liked : ''}`}
      onClick={(e) => { e.stopPropagation(); onLike() }}
    >
      <Icon
        iconId={reaction === CurrentUserReaction.Like ? 'heart-filled' : 'heart-outline'}
        width="30"
        height="30"
        viewBox="0 0 28 28"
      />
    </div>
    <div
      className={`${s.btn} ${reaction === CurrentUserReaction.Dislike ? s.disliked : ''}`}
      onClick={(e) => { e.stopPropagation(); onDislike() }}
    >
      <Icon
        iconId={reaction === CurrentUserReaction.Dislike ? 'dislike-filled' : 'dislike'}
        width="30"
        height="30"
        viewBox="0 0 28 28"
      />
    </div>
  </div>
)
