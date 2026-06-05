import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventsTimelineSidebar from '../components/events/EventsTimelineSidebar'
import HostPartnershipsView from '../components/events/HostPartnershipsView'
import SponsorshipCloseCaseModal from '../components/events/SponsorshipCloseCaseModal'
import { availableBrands } from '../data/mockEvents'
import {
  getHostPartnerships,
  pickDefaultEventId,
  splitEventsByTimeline,
} from '../utils/hostEventBuckets'
import {
  getPendingClosureCases,
  SPONSORSHIP_STATUS,
} from '../utils/sponsorshipLifecycle'
import {
  getInvitedBrandsForEvent,
  getSuggestedBrands,
} from '../utils/eventSponsorMatch'
import MatchesAndRequests from './MatchesAndRequests'

export default function MyEventsAndProposals({
  events,
  hostProfile,
  onEventsChange,
  onCreateEvent,
  focusEventId,
  onFocusEventConsumed,
  onOpenChat,
  onBrandsMatch,
  onProposeToBrand,
  onGoToProfile,
}) {
  const [panelMode, setPanelMode] = useState('event')
  const [selectedEventId, setSelectedEventId] = useState(() => pickDefaultEventId(events))
  const [closeCaseTarget, setCloseCaseTarget] = useState(null)
  const prevEventsLength = useRef(events.length)

  const { upcoming, past } = useMemo(() => splitEventsByTimeline(events), [events])
  const partnerships = useMemo(
    () => getHostPartnerships(events, availableBrands),
    [events],
  )

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null

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
    if (!selectedEventId || !events.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(pickDefaultEventId(events))
    }
  }, [events, selectedEventId])

  useEffect(() => {
    if (focusEventId && events.find((e) => e.id === focusEventId)) {
      setSelectedEventId(focusEventId)
      setPanelMode('event')
      onFocusEventConsumed?.()
    }
  }, [focusEventId, events, onFocusEventConsumed])

  useEffect(() => {
    if (events.length > prevEventsLength.current && events[0] && !focusEventId) {
      const { upcoming: up } = splitEventsByTimeline(events)
      setSelectedEventId(up[0]?.id ?? events[0].id)
      setPanelMode('event')
    }
    prevEventsLength.current = events.length
  }, [events, focusEventId])

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId)
    setPanelMode('event')
  }

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

  const handleSelectEventFromPartnership = (eventId) => {
    setSelectedEventId(eventId)
    setPanelMode('event')
  }

  if (events.length === 0) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center bg-background p-12 text-center">
        <p className="type-heading font-display font-bold text-foreground">
          Publicá tu primer evento
        </p>
        <p className="type-body-muted mx-auto mt-2 max-w-sm">
          Creá un evento en CABA para invitar marcas y gestionar patrocinios.
        </p>
        <Button type="button" size="event" className="mt-8 gap-2 px-8" onClick={onCreateEvent}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
        {onGoToProfile && (
          <button
            type="button"
            onClick={onGoToProfile}
            className="type-small mt-4 font-semibold text-muted-foreground underline-offset-2 hover:underline"
          >
            Completar Mi Perfil
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      <EventsTimelineSidebar
        upcoming={upcoming}
        past={past}
        selectedId={selectedEvent?.id}
        panelMode={panelMode}
        partnershipCount={partnerships.length}
        onSelectEvent={handleSelectEvent}
        onShowPartnerships={() => setPanelMode('partnerships')}
        onCreateEvent={onCreateEvent}
        onGoToProfile={onGoToProfile}
      />

      <div className="min-w-0 flex-1 overflow-y-auto">
        {panelMode === 'partnerships' ? (
          <HostPartnershipsView
            partnerships={partnerships}
            profile={hostProfile}
            onGoToProfile={onGoToProfile}
            onSelectEvent={handleSelectEventFromPartnership}
          />
        ) : selectedEvent ? (
          <>
            <MatchesAndRequests
              compact
              event={selectedEvent}
              invitedBrands={invitedBrands}
              suggestedBrands={suggestedBrands}
              onInvite={handleInvite}
              onOpenChat={handleOpenChat}
              onEventUpdate={handleEventUpdate}
              pendingCasesForEvent={pendingCases.filter(
                (c) => c.eventId === selectedEvent.id,
              )}
              onCloseCaseForBrand={(brandId) => {
                const match = pendingCases.find(
                  (c) => c.eventId === selectedEvent.id && c.brandId === brandId,
                )
                if (match) setCloseCaseTarget(match)
              }}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <p className="uanabi-meta">Seleccioná un evento</p>
          </div>
        )}
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
