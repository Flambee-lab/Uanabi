import { SPONSORSHIP_STATUS } from './sponsorshipLifecycle'

const CONFIRMED = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
])

export function findBrandInCatalog(name, catalog = []) {
  if (!name?.trim()) return null
  const lower = name.trim().toLowerCase()
  return catalog.find((b) => b.name?.trim().toLowerCase() === lower) ?? null
}

export function getEventPartnerBrands(event, catalog = []) {
  return (event.invitedBrands ?? [])
    .filter((invite) => CONFIRMED.has(invite.status))
    .map((invite) => catalog.find((b) => b.id === invite.brandId))
    .filter(Boolean)
}
