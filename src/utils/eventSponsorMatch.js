/** Industrias sugeridas por nicho del evento cuando no hay matchIndustries explícito */
export const NICHE_INDUSTRY_MAP = {
  Gaming: ['Bebidas', 'Tecnología'],
  Moda: ['Indumentaria', 'Bebidas', 'Entretenimiento'],
  Gastronomía: ['Bebidas', 'Gastronomía'],
  Entretenimiento: ['Bebidas', 'Entretenimiento', 'Tecnología'],
  Lifestyle: ['Bebidas', 'Entretenimiento', 'Indumentaria'],
}

export function getMatchIndustriesForEvent(event) {
  if (event?.matchIndustries?.length) return event.matchIndustries
  if (event?.niche && NICHE_INDUSTRY_MAP[event.niche]) return NICHE_INDUSTRY_MAP[event.niche]
  return []
}

export function getInvitedBrandIds(event) {
  return new Set((event?.invitedBrands ?? []).map((i) => i.brandId))
}

function matchesBrandSearch(brand, q, locationHint) {
  return (
    brand.name.toLowerCase().includes(q) ||
    brand.industry.toLowerCase().includes(q) ||
    brand.zone.toLowerCase().includes(q) ||
    (brand.budgetType?.toLowerCase().includes(q) ?? false) ||
    (locationHint && brand.zone.toLowerCase().includes(locationHint))
  )
}

export function getSuggestedBrands(event, catalog, { searchQuery = '' } = {}) {
  if (!event) return []

  const industries = getMatchIndustriesForEvent(event)
  const invitedIds = getInvitedBrandIds(event)
  const q = searchQuery.trim().toLowerCase()
  const locationHint = (event.location ?? '').toLowerCase().split(',')[0]?.trim()

  let list

  if (q) {
    list = catalog.filter(
      (brand) => !invitedIds.has(brand.id) && matchesBrandSearch(brand, q, locationHint),
    )
  } else {
    list = catalog.filter(
      (brand) => !invitedIds.has(brand.id) && industries.includes(brand.industry),
    )
  }

  return list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
}

export function getInvitedBrandsForEvent(event, catalog, { searchQuery = '' } = {}) {
  if (!event) return []

  let list = (event.invitedBrands ?? [])
    .map((invite) => {
      const brand = catalog.find((b) => b.id === invite.brandId)
      if (!brand) return null
      return {
        ...brand,
        invitationStatus: invite.status,
        invitedAt: invite.invitedAt,
      }
    })
    .filter(Boolean)

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    list = list.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) || brand.industry.toLowerCase().includes(q),
    )
  }

  return list
}

export function countEventInvites(event) {
  const invites = event?.invitedBrands ?? []
  return {
    matches: invites.filter((i) => i.status === 'match_aceptado').length,
    activeInvites: invites.filter((i) => i.status === 'invitada').length,
  }
}

export const INVITATION_STATUS_LABELS = {
  invitada: 'Invitada',
  match_aceptado: 'Match Aceptado',
  declinado: 'Declinado',
}
