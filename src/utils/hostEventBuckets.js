import { isEventPast, inviteNeedsClosure, SPONSORSHIP_STATUS } from './sponsorshipLifecycle'
import { getInvitationStatusLabel } from './eventSponsorMatch'

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
  const { past } = splitEventsByTimeline(events, referenceDate)
  return past.filter((event) =>
    (event.invitedBrands ?? []).some((invite) => inviteNeedsClosure(invite, event)),
  ).length
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
