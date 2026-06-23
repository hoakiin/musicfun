const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

export const formatRelativeDate = (dateString: string | null) => {
  if (!dateString) return ""
  const now = Date.now()
  const diff = now - new Date(dateString).getTime()

  if (diff < MINUTE) return "just now"
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minute${Math.floor(diff / MINUTE) > 1 ? "s" : ""} ago`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hour${Math.floor(diff / HOUR) > 1 ? "s" : ""} ago`
  if (diff < MONTH) return `${Math.floor(diff / DAY)} day${Math.floor(diff / DAY) > 1 ? "s" : ""} ago`
  if (diff < 2 * MONTH) return `1 month ago`
  return new Date(dateString).toLocaleDateString("en-GB")
}
