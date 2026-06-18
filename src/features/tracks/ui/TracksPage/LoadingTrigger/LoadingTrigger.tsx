import type { RefObject } from 'react'
import s from './LoadingTrigger.module.css'

type Props = {
  observerRef: RefObject<HTMLDivElement | null>
  isFetchingNextPage: boolean
}

export const LoadingTrigger = ({ observerRef, isFetchingNextPage }: Props) => {
  return (
    <div ref={observerRef}>
      {isFetchingNextPage ? (
        <div className={s.spinner} />
      ) : (
        <div style={{ height: '20px' }} />
      )}
    </div>
  )
}
