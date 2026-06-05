import { getEventPublicationDisplay } from './eventPublicationStatus'

export function parsePresencialCount(audience) {
  if (!audience) return null
  const match = audience.match(/([\d.,]+)\s*presencial/i)
  if (match) {
    const n = parseInt(match[1].replace(/\D/g, ''), 10)
    return Number.isNaN(n) ? null : n
  }
  const plain = audience.match(/^(\d{1,4})\b/)
  return plain ? parseInt(plain[1], 10) : null
}

export function formatEventDateShort(date, locale = 'es-AR') {
  if (!date) return '—'
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getEventStatusLabel(event, referenceDate = new Date()) {
  return getEventPublicationDisplay(event, referenceDate).label
}

export function getAudienceGenderLabel(event) {
  const raw = event?.audienceGender?.trim()
  return raw || null
}

export function getEventFacts(event) {
  const presencial = parsePresencialCount(event?.audience)
  const attendees =
    presencial != null ? String(presencial) : event?.audience?.trim() || '—'

  return {
    type: event?.niche ?? '—',
    attendees,
    date: formatEventDateShort(event?.date),
    location: event?.venueAddress ?? event?.location ?? '—',
    gender: getAudienceGenderLabel(event) ?? 'A definir',
    exchange: 'Productos',
    status: getEventStatusLabel(event),
  }
}
