import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventsTimelineSidebar from '../components/events/EventsTimelineSidebar'
import HostPastEventsView from '../components/events/HostPastEventsView'
import { availableBrands } from '../data/mockEvents'
import {
  countPastEventsWithPendingActions,
  isUpcomingEvent,
  pickDefaultEventId,
  splitEventsByTimeline,
} from '../utils/hostEventBuckets'
import {
  isEventPast,
} from '../utils/sponsorshipLifecycle'
import { migrateLegacyApprovedBannerDismiss } from '../utils/eventInlineNotifications'
import {
  getInvitedBrandsForEvent,
  getSuggestedBrands,
} from '../utils/eventSponsorMatch'
import DeleteEventConfirmModal from '../components/events/DeleteEventConfirmModal'
import MatchesAndRequests from './MatchesAndRequests'
import { withRuntimeDemoDates } from '../utils/myEventsRuntime'

export default function MyEventsAndProposals({
  events,
  hostProfile,
  onEventsChange,
  onCreateEvent,
  focusEventId,
  onFocusEventConsumed,
  onProposeToBrand,
  onGoToProfile,
}) {
  const [panelMode, setPanelMode] = useState('event')
  const [detailSource, setDetailSource] = useState('active')
  const [selectedEventId, setSelectedEventId] = useState(() => pickDefaultEventId(events))
  const [deleteEventTarget, setDeleteEventTarget] = useState(null)
  const [notifRevision, setNotifRevision] = useState(0)
  const prevEventsLength = useRef(events.length)

  const timelineEvents = useMemo(() => withRuntimeDemoDates(events), [events])
  const { upcoming, past } = useMemo(() => splitEventsByTimeline(timelineEvents), [timelineEvents])
  const pastPendingCount = useMemo(
    () => countPastEventsWithPendingActions(timelineEvents),
    [timelineEvents],
  )
  const selectedEvent = timelineEvents.find((e) => e.id === selectedEventId) ?? null

  const invitedBrands = useMemo(
    () => getInvitedBrandsForEvent(selectedEvent, availableBrands),
    [selectedEvent],
  )

  const suggestedBrands = useMemo(
    () => getSuggestedBrands(selectedEvent, availableBrands),
    [selectedEvent],
  )

  useEffect(() => {
    if (!selectedEventId || !timelineEvents.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(pickDefaultEventId(timelineEvents))
      setDetailSource('active')
      return
    }

    if (
      detailSource === 'active' &&
      panelMode === 'event' &&
      !isUpcomingEvent(timelineEvents.find((e) => e.id === selectedEventId), timelineEvents)
    ) {
      setSelectedEventId(pickDefaultEventId(timelineEvents))
    }
  }, [timelineEvents, selectedEventId, detailSource, panelMode])

  useEffect(() => {
    if (focusEventId && timelineEvents.find((e) => e.id === focusEventId)) {
      const focused = timelineEvents.find((e) => e.id === focusEventId)
      const fromPast = isEventPast(focused)
      setSelectedEventId(focusEventId)
      setDetailSource(fromPast ? 'past' : 'active')
      setPanelMode('event')
      setNotifRevision((revision) => revision + 1)
      onFocusEventConsumed?.()
    }
  }, [focusEventId, timelineEvents, onFocusEventConsumed])

  useEffect(() => {
    events.forEach((event) => {
      const invited = getInvitedBrandsForEvent(event, availableBrands)
      migrateLegacyApprovedBannerDismiss(event.id, invited)
    })
    setNotifRevision((revision) => revision + 1)
  }, [events])

  useEffect(() => {
    if (timelineEvents.length > prevEventsLength.current && !focusEventId) {
      setSelectedEventId(pickDefaultEventId(timelineEvents))
      setDetailSource('active')
      setPanelMode('event')
    }
    prevEventsLength.current = timelineEvents.length
  }, [timelineEvents, focusEventId])

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId)
    setDetailSource('active')
    setPanelMode('event')
  }

  const handleInvite = (brandId) => {
    if (!selectedEvent?.id) return
    onProposeToBrand?.(brandId, selectedEvent)
  }

  const handleEventUpdate = (updated) => {
    onEventsChange((prev) =>
      prev.map((event) => {
        if (event.id !== updated.id) return event
        if (isEventPast(event)) return event
        return { ...event, ...updated }
      }),
    )
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

  const handleOpenChat = (brandId) => {
    onBrandsMatch?.(brandId)
    onOpenChat?.(brandId)
  }

  const handleSelectEventFromPast = (eventId) => {
    setSelectedEventId(eventId)
    setDetailSource('past')
    setPanelMode('event')
  }

  const handleDeleteEvent = (eventId) => {
    const remaining = timelineEvents.filter((event) => event.id !== eventId)
    setSelectedEventId((current) =>
      current === eventId ? pickDefaultEventId(remaining) : current,
    )
    onEventsChange((prev) => prev.filter((event) => event.id !== eventId))
    setDeleteEventTarget(null)
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
        <Button type="button" variant="primary" size="lg" className="mt-8" onClick={onCreateEvent}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
        {onGoToProfile && (
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="mt-4 text-muted-foreground"
            onClick={onGoToProfile}
          >
            Completar Mi Perfil
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background lg:flex-row">
      <EventsTimelineSidebar
        upcoming={upcoming}
        past={past}
        pastPendingCount={pastPendingCount}
        selectedId={panelMode === 'event' ? selectedEventId : null}
        panelMode={panelMode}
        brandCatalog={availableBrands}
        notifRevision={notifRevision}
        onSelectEvent={handleSelectEvent}
        onSelectPastEvent={handleSelectEventFromPast}
        onShowPastEvents={() => {
          setPanelMode('past')
          setDetailSource('active')
        }}
        onCreateEvent={onCreateEvent}
      />

      <div className="min-w-0 flex-1 overflow-hidden">
        {panelMode === 'past' ? (
          <HostPastEventsView
            events={past}
            brandCatalog={availableBrands}
            pendingCount={pastPendingCount}
            onSelectEvent={handleSelectEventFromPast}
          />
        ) : selectedEvent &&
          (detailSource === 'past' || isUpcomingEvent(selectedEvent, timelineEvents)) ? (
          <>
            <MatchesAndRequests
              event={selectedEvent}
              invitedBrands={invitedBrands}
              suggestedBrands={suggestedBrands}
              hostProfile={hostProfile}
              onInvite={handleInvite}
              onEventUpdate={handleEventUpdate}
              notifRevision={notifRevision}
              onNotificationsDismissed={() => setNotifRevision((revision) => revision + 1)}
              onEventsChange={onEventsChange}
              onDeleteEventRequest={setDeleteEventTarget}
            />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <p className="type-body font-semibold text-foreground">Seleccioná un evento</p>
            <p className="type-small mt-1 max-w-xs text-muted-foreground">
              Elegí un evento de la lista para gestionar sus patrocinios, o creá uno nuevo.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-5"
              onClick={onCreateEvent}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Crear evento
            </Button>
          </div>
        )}
      </div>

      <DeleteEventConfirmModal
        isOpen={Boolean(deleteEventTarget)}
        event={deleteEventTarget}
        onClose={() => setDeleteEventTarget(null)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  )
}
