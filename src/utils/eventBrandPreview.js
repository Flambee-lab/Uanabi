const PREVIEW_STORAGE_PREFIX = 'uanabi-event-brand-preview-'

export function getEventPreviewIdFromUrl(search = window.location.search) {
  return new URLSearchParams(search).get('evento')
}

export function storeEventBrandPreviewPayload(event, hostProfile) {
  if (!event?.id || typeof window === 'undefined') return
  window.sessionStorage.setItem(
    `${PREVIEW_STORAGE_PREFIX}${event.id}`,
    JSON.stringify({ event, hostProfile, savedAt: Date.now() }),
  )
}

export function getEventBrandPreviewPayload(eventId) {
  if (!eventId || typeof window === 'undefined') return null
  const raw = window.sessionStorage.getItem(`${PREVIEW_STORAGE_PREFIX}${eventId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function openEventBrandPreview(event, hostProfile) {
  if (!event?.id || typeof window === 'undefined') return
  storeEventBrandPreviewPayload(event, hostProfile)
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('evento', event.id)
  window.open(url.toString(), '_blank', 'noopener,noreferrer')
}
