import { useEffect, useMemo, useRef, useState } from 'react'
import EventLumaPage from '../components/event-luma/EventLumaPage'
import EventPickerRail from '../components/event-luma/EventPickerRail'
import { availableBrands } from '../data/mockEvents'
import {
  getInvitedBrandsForEvent,
  getSuggestedBrands,
} from '../utils/eventSponsorMatch'

export default function MyEventsAndProposals({
  events,
  onEventsChange,
  onCreateEvent,
  focusEventId,
  onFocusEventConsumed,
  onOpenChat,
  onBrandsMatch,
}) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? null)
  const [sponsorSearch, setSponsorSearch] = useState('')
  const prevEventsLength = useRef(events.length)

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? events[0]

  const invitedBrands = useMemo(
    () => getInvitedBrandsForEvent(selectedEvent, availableBrands),
    [selectedEvent],
  )

  const suggestedBrands = useMemo(
    () =>
      getSuggestedBrands(selectedEvent, availableBrands, {
        searchQuery: sponsorSearch,
      }),
    [selectedEvent, sponsorSearch],
  )

  useEffect(() => {
    if (!events.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(events[0]?.id ?? null)
    }
  }, [events, selectedEventId])

  useEffect(() => {
    if (focusEventId && events.find((e) => e.id === focusEventId)) {
      setSelectedEventId(focusEventId)
      setSponsorSearch('')
      onFocusEventConsumed?.()
    }
  }, [focusEventId, events, onFocusEventConsumed])

  useEffect(() => {
    if (events.length > prevEventsLength.current && events[0] && !focusEventId) {
      setSelectedEventId(events[0].id)
    }
    prevEventsLength.current = events.length
  }, [events, focusEventId])

  const handleInvite = (brandId) => {
    if (!selectedEvent?.id) return
    onEventsChange((prev) =>
      prev.map((event) => {
        if (event.id !== selectedEvent.id) return event
        const already = (event.invitedBrands ?? []).some((i) => i.brandId === brandId)
        if (already) return event
        return {
          ...event,
          invitedBrands: [
            ...(event.invitedBrands ?? []),
            {
              brandId,
              status: 'invitada',
              invitedAt: new Date().toISOString().slice(0, 10),
            },
          ],
        }
      }),
    )
  }

  const handleOpenChat = (brandId) => {
    onBrandsMatch?.(brandId)
    onOpenChat?.(brandId)
  }

  if (!selectedEvent) {
    return (
      <div className="flex h-full items-center justify-center bg-[#fafafa] p-12 text-center">
        <div>
          <p className="font-display text-lg font-bold text-neutral-700">Sin eventos aún</p>
          <p className="mt-2 text-sm text-neutral-400">
            Usá &quot;Crear evento&quot; para publicar tu primer evento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-white">
      <EventPickerRail
        events={events}
        selectedId={selectedEvent.id}
        onCreateEvent={onCreateEvent}
        onSelect={(id) => {
          setSelectedEventId(id)
          setSponsorSearch('')
        }}
      />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <EventLumaPage
          event={selectedEvent}
          invitedBrands={invitedBrands}
          suggestedBrands={suggestedBrands}
          sponsorSearch={sponsorSearch}
          onSponsorSearchChange={setSponsorSearch}
          onInvite={handleInvite}
          onOpenChat={handleOpenChat}
        />
      </div>
    </div>
  )
}
