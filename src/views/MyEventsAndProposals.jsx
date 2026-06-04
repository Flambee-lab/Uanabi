import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import PendingSponsorshipBanner from '../components/events/PendingSponsorshipBanner'
import SponsorshipCloseCaseModal from '../components/events/SponsorshipCloseCaseModal'
import EventPickerRail from '../components/event-luma/EventPickerRail'
import { availableBrands } from '../data/mockEvents'
import { getPendingClosureCases } from '../utils/sponsorshipLifecycle'
import {
  getInvitedBrandsForEvent,
  getSuggestedBrands,
} from '../utils/eventSponsorMatch'
import MatchesAndRequests from './MatchesAndRequests'

export default function MyEventsAndProposals({
  events,
  onEventsChange,
  onCreateEvent,
  focusEventId,
  onFocusEventConsumed,
  onOpenChat,
  onBrandsMatch,
  onProposeToBrand,
}) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? null)
  const [closeCaseTarget, setCloseCaseTarget] = useState(null)
  const prevEventsLength = useRef(events.length)

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? events[0]

  const pendingCases = useMemo(
    () => getPendingClosureCases(events, availableBrands),
    [events],
  )

  const invitedBrands = useMemo(
    () => getInvitedBrandsForEvent(selectedEvent, availableBrands),
    [selectedEvent],
  )

  const suggestedBrands = useMemo(
    () => getSuggestedBrands(selectedEvent, availableBrands),
    [selectedEvent],
  )

  useEffect(() => {
    if (!events.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(events[0]?.id ?? null)
    }
  }, [events, selectedEventId])

  useEffect(() => {
    if (focusEventId && events.find((e) => e.id === focusEventId)) {
      setSelectedEventId(focusEventId)
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
    onProposeToBrand?.(brandId, selectedEvent)
  }

  const handleEventUpdate = (updated) => {
    onEventsChange((prev) =>
      prev.map((event) => (event.id === updated.id ? { ...event, ...updated } : event)),
    )
  }

  const handleOpenChat = (brandId) => {
    onBrandsMatch?.(brandId)
    onOpenChat?.(brandId)
  }

  const handleCloseCaseSubmit = (submission) => {
    if (!closeCaseTarget) return
    const { eventId, brandId } = closeCaseTarget
    onEventsChange((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        return {
          ...event,
          invitedBrands: (event.invitedBrands ?? []).map((inv) =>
            inv.brandId === brandId
              ? {
                  ...inv,
                  status: SPONSORSHIP_STATUS.EN_VERIFICACION,
                  closureSubmission: submission,
                }
              : inv,
          ),
        }
      }),
    )
  }

  const handleBannerCloseCase = () => {
    const first = pendingCases[0]
    if (!first) return
    setSelectedEventId(first.eventId)
    setCloseCaseTarget(first)
  }

  if (!selectedEvent) {
    return (
      <div className="flex h-full min-h-0 w-full overflow-hidden bg-white">
        <EventPickerRail
          events={events}
          selectedId={null}
          onCreateEvent={onCreateEvent}
          onSelect={setSelectedEventId}
        />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center p-12 text-center">
          <p className="font-display text-xl font-black tracking-tight text-neutral-900">
            Publicá tu primer evento
          </p>
          <p className="mt-3 max-w-sm text-sm text-neutral-500">
            Creá un evento en CABA para invitar marcas y enviar propuestas de patrocinio.
          </p>
          <button
            type="button"
            onClick={onCreateEvent}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Crear evento
          </button>
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
        onSelect={setSelectedEventId}
      />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 pt-8">
          <PendingSponsorshipBanner
            count={pendingCases.length}
            onCloseCase={handleBannerCloseCase}
          />
        </div>

        <MatchesAndRequests
          event={selectedEvent}
          invitedBrands={invitedBrands}
          suggestedBrands={suggestedBrands}
          onInvite={handleInvite}
          onOpenChat={handleOpenChat}
          onEventUpdate={handleEventUpdate}
          pendingCasesForEvent={pendingCases.filter((c) => c.eventId === selectedEvent.id)}
          onCloseCaseForBrand={(brandId) => {
            const match = pendingCases.find(
              (c) => c.eventId === selectedEvent.id && c.brandId === brandId,
            )
            if (match) setCloseCaseTarget(match)
          }}
        />
      </div>

      <SponsorshipCloseCaseModal
        isOpen={Boolean(closeCaseTarget)}
        caseInfo={closeCaseTarget}
        onClose={() => setCloseCaseTarget(null)}
        onSubmit={handleCloseCaseSubmit}
      />
    </div>
  )
}
