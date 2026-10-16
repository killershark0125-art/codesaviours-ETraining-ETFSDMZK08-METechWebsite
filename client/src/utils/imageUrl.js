const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/$/, '')

export function imageUrl(value, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) return fallback
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/')) return `${SERVER_URL}${value}`
  return fallback
}
