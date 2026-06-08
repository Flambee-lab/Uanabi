import { useMemo } from 'react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import { DEFAULT_HOST_PROFILE } from '../data/hostProfile'
import { myEvents as mockMyEvents } from '../data/mockEvents'
import { getEventBrandPreviewPayload, getEventPreviewIdFromUrl } from '../utils/eventBrandPreview'

export default function EventBrandPreviewView({ eventId: eventIdProp }) {
  const eventId = eventIdProp ?? getEventPreviewIdFromUrl()

  const { event, hostProfile } = useMemo(() => {
    const stored = eventId ? getEventBrandPreviewPayload(eventId) : null
    if (stored?.event) {
      return {
        event: stored.event,
        hostProfile: stored.hostProfile ?? DEFAULT_HOST_PROFILE,
      }
    }

    const fallbackEvent = mockMyEvents.find((item) => item.id === eventId) ?? null
    return {
      event: fallbackEvent,
      hostProfile: DEFAULT_HOST_PROFILE,
    }
  }, [eventId])

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No encontramos este evento. Volvé a abrir la vista desde Mis eventos.
        </p>
      </div>
    )
  }

  return (
    <EventCommercialSheet
      event={event}
      hostProfile={hostProfile}
      previewMode
      onBack={() => window.close()}
    />
  )
}
