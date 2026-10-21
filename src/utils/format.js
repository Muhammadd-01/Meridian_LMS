const DAY = 24 * 60 * 60 * 1000

export function toDate(value) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const d = toDate(value)
  return d ? d.toLocaleDateString('en-US', options) : '—'
}

export function formatDateTime(value) {
  const d = toDate(value)
  return d
    ? d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—'
}

export function relativeTime(value, now = new Date()) {
  const d = toDate(value)
  if (!d) return '—'
  const diff = now.getTime() - d.getTime()
  const future = diff < 0
  const abs = Math.abs(diff)
  const mins = Math.round(abs / 60000)
  let text
  if (mins < 1) return 'just now'
  if (mins < 60) text = `${mins} min`
  else if (mins < 60 * 24) text = `${Math.round(mins / 60)} hr`
  else if (abs < 30 * DAY) {
    const days = Math.round(abs / DAY)
    text = `${days} day${days === 1 ? '' : 's'}`
  } else return formatDate(d)
  return future ? `in ${text}` : `${text} ago`
}

export function daysBetween(a, b) {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.round(value || 0))
}

export function formatCompact(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0)
}

export function formatMinutes(minutes) {
  const m = Math.max(0, Math.round(minutes || 0))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} hr ${rest} min` : `${h} hr`
}

export function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function percent(value) {
  return `${Math.round(value || 0)}%`
}

export function isoDay(value) {
  const d = toDate(value)
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
