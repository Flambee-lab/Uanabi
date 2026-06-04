import { SPONSORSHIP_STATUS } from './sponsorshipLifecycle'

export const LEAD_TIME_OPTIONS = [
  { value: '3', label: '3 días hábiles' },
  { value: '5', label: '5 días hábiles' },
  { value: '7', label: '7 días hábiles' },
  { value: '10', label: '10 días hábiles' },
  { value: '14', label: '14 días hábiles' },
]

export function buildCommercialSnapshot(event) {
  if (!event) return null
  return {
    eventId: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.venueAddress ?? event.location,
    niche: event.niche,
    audience: event.audience,
    description: event.description,
    offers: event.offers ?? [],
    seeks: event.seeks ?? [],
    coverGradient: event.coverGradient,
  }
}

export function createInvitationRecord(brandId, proposal) {
  return {
    brandId,
    status: SPONSORSHIP_STATUS.INVITACION_ENVIADA,
    invitedAt: new Date().toISOString().slice(0, 10),
    proposal: {
      materialRequest: proposal.materialRequest.trim(),
      leadTimeDays: proposal.leadTimeDays,
      commercialSnapshot: proposal.commercialSnapshot,
      submittedAt: new Date().toISOString(),
    },
  }
}

export function appendInvitationToEvent(event, invitation) {
  const existing = event.invitedBrands ?? []
  if (existing.some((i) => i.brandId === invitation.brandId)) {
    return {
      ...event,
      invitedBrands: existing.map((i) =>
        i.brandId === invitation.brandId ? { ...i, ...invitation } : i,
      ),
    }
  }
  return {
    ...event,
    invitedBrands: [...existing, invitation],
  }
}
