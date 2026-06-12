import {
  formatVerificationAttentionMessage,
  isEventPast,
  inviteNeedsHostVerificationUpload,
  SPONSORSHIP_STATUS,
} from './sponsorshipLifecycle'
import { getInvitedBrandsForEvent, getInvitationStatusLabel } from './eventSponsorMatch'

const CONFIRMED_STATUSES = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
])

export function splitEventsByTimeline(events, referenceDate = new Date()) {
  const upcoming = []
  const past = []

  for (const event of events ?? []) {
    if (isEventPast(event, referenceDate)) past.push(event)
    else upcoming.push(event)
  }

  const byDate = (a, b) => String(a.date).localeCompare(String(b.date))
  upcoming.sort(byDate)
  past.sort((a, b) => byDate(b, a))

  return { upcoming, past }
}

export function countPastEventsWithPendingActions(events, referenceDate = new Date()) {
  return getPastEventsNeedingAction(events, [], referenceDate).length
}

/** Resumen de la acción pendiente del host en un evento pasado (verificación). */
export function getEventHostActionSummary(event, catalog = [], referenceDate = new Date()) {
  if (!event || !isEventPast(event, referenceDate)) return null

  const invitedBrands = getInvitedBrandsForEvent(event, catalog)
  const pendingBrands = invitedBrands.filter((brand) =>
    inviteNeedsHostVerificationUpload({ status: brand.invitationStatus }, event),
  )

  if (pendingBrands.length === 0) return null

  return {
    type: 'verification',
    brandId: pendingBrands[0].id,
    brandName: pendingBrands[0].name,
    pendingCount: pendingBrands.length,
    message: formatVerificationAttentionMessage(pendingBrands.length, pendingBrands[0].name),
  }
}

/** Eventos pasados que requieren acción del host, ordenados del más reciente al más antiguo. */
export function getPastEventsNeedingAction(events, catalog = [], referenceDate = new Date()) {
  const { past } = splitEventsByTimeline(events, referenceDate)

  return past
    .map((event) => ({
      event,
      action: getEventHostActionSummary(event, catalog, referenceDate),
    }))
    .filter(({ action }) => Boolean(action))
    .sort((a, b) => String(b.event.date).localeCompare(String(a.event.date)))
}

export function getHostPartnerships(events, catalog = []) {
  const items = []

  for (const event of events ?? []) {
    const past = isEventPast(event)
    for (const invite of event.invitedBrands ?? []) {
      if (!CONFIRMED_STATUSES.has(invite.status)) continue
      const brand = catalog.find((b) => b.id === invite.brandId)
      items.push({
        id: `${event.id}-${invite.brandId}`,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventNiche: event.niche,
        brandId: invite.brandId,
        brandName: brand?.name ?? 'Marca',
        brandLogo: brand?.logo ?? null,
        brandIndustry: brand?.industry,
        status: invite.status,
        statusLabel: getInvitationStatusLabel(invite.status),
        invitedAt: invite.invitedAt,
        isPastEvent: past,
      })
    }
  }

  return items.sort((a, b) => String(b.invitedAt ?? '').localeCompare(String(a.invitedAt ?? '')))
}

export function countPartnershipsInProfile(partnerships, successStories = []) {
  if (!partnerships.length) return 0
  const publishedBrands = new Set(
    successStories.flatMap((s) => (s.brandNames ?? []).map((n) => n.toLowerCase())),
  )
  return partnerships.filter((p) => publishedBrands.has(p.brandName.toLowerCase())).length
}

export function pickDefaultEventId(events, referenceDate = new Date()) {
  const { upcoming } = splitEventsByTimeline(events, referenceDate)
  return upcoming[0]?.id ?? null
}

export function isUpcomingEvent(event, events, referenceDate = new Date()) {
  if (!event?.id) return false
  const { upcoming } = splitEventsByTimeline(events, referenceDate)
  return upcoming.some((item) => item.id === event.id)
}
