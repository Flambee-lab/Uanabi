export function toLocalDateISO(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Ajusta fechas de demo que deben resolverse en runtime (no al import del bundle).
 */
export function withRuntimeDemoDates(events, referenceDate = new Date()) {
  const yesterday = new Date(referenceDate)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = toLocalDateISO(yesterday)

  return (events ?? []).map((event) =>
    event.id === 'evt-past-close' ? { ...event, date: yesterdayISO } : event,
  )
}