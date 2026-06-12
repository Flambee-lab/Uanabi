import {
  isInvitationInReview,
  sortInvitedBrands,
  SPONSORSHIP_STATUS,
} from './sponsorshipLifecycle'

export const PROPOSAL_FILTER = {
  ALL: 'all',
  APPROVED: 'approved',
  DECLINED: 'declined',
  IN_REVIEW: 'in_review',
  RECOMMENDED: 'recommended',
  VERIFICATION: 'verification',
}

const PAST_EVENT_VERIFICATION_STATUSES = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.CASO_ABIERTO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
])

const APPROVED_STATUSES = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.CASO_ABIERTO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
])

const ALL_VIEW_SECTIONS = [
  { id: 'approved', title: 'Aprobadas', category: PROPOSAL_FILTER.APPROVED },
  { id: 'declined', title: 'Rechazadas', category: PROPOSAL_FILTER.DECLINED },
  { id: 'in_review', title: 'En revisión', category: PROPOSAL_FILTER.IN_REVIEW },
]

export function categorizeProposalStatus(status) {
  if (status === SPONSORSHIP_STATUS.DECLINADO) return PROPOSAL_FILTER.DECLINED
  if (isInvitationInReview(status)) return PROPOSAL_FILTER.IN_REVIEW
  if (APPROVED_STATUSES.has(status)) return PROPOSAL_FILTER.APPROVED
  return PROPOSAL_FILTER.IN_REVIEW
}

/** Patrocinios confirmados que entran en verificación post-evento (sin rechazadas ni en revisión). */
export function getPastEventVerificationBrands(brands = []) {
  return sortInvitedBrands(
    brands.filter((brand) => PAST_EVENT_VERIFICATION_STATUSES.has(brand.invitationStatus)),
  )
}

export function getProposalFilterCounts(invitedBrands = [], recommendedCount = 0) {
  const counts = {
    [PROPOSAL_FILTER.ALL]: invitedBrands.length,
    [PROPOSAL_FILTER.APPROVED]: 0,
    [PROPOSAL_FILTER.DECLINED]: 0,
    [PROPOSAL_FILTER.IN_REVIEW]: 0,
    [PROPOSAL_FILTER.RECOMMENDED]: recommendedCount,
  }

  for (const brand of invitedBrands) {
    const category = categorizeProposalStatus(brand.invitationStatus)
    if (category in counts && category !== PROPOSAL_FILTER.ALL) {
      counts[category] += 1
    }
  }

  return counts
}

export function getProposalBrandGroups(brands = [], filter = PROPOSAL_FILTER.ALL) {
  const sorted = sortInvitedBrands(brands)

  if (filter === PROPOSAL_FILTER.ALL) {
    return ALL_VIEW_SECTIONS.map((section) => ({
      ...section,
      items: sorted.filter(
        (brand) => categorizeProposalStatus(brand.invitationStatus) === section.category,
      ),
    })).filter((group) => group.items.length > 0)
  }

  const items = sorted.filter(
    (brand) => categorizeProposalStatus(brand.invitationStatus) === filter,
  )

  if (items.length === 0) return []

  return [{ id: filter, title: '', items, hideTitle: true }]
}

export function getProposalEmptyMessage(filter) {
  switch (filter) {
    case PROPOSAL_FILTER.APPROVED:
      return 'Todavía no tenés marcas aprobadas para este evento.'
    case PROPOSAL_FILTER.DECLINED:
      return 'No hay solicitudes rechazadas.'
    case PROPOSAL_FILTER.IN_REVIEW:
      return 'No hay propuestas en revisión por ahora.'
    case PROPOSAL_FILTER.VERIFICATION:
      return 'No hay patrocinios confirmados para verificar en este evento.'
    default:
      return 'Todavía no enviaste propuestas a marcas para este evento.'
  }
}
