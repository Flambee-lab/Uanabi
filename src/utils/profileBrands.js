import { getHostPartnerships } from './hostEventBuckets'
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

/** Marcas con patrocinio confirmado en eventos del host (verificadas por Uanabi). */
export function getVerifiedPartnerBrands(events, catalog = []) {
  const seen = new Set()
  const brands = []

  for (const partnership of getHostPartnerships(events, catalog)) {
    if (seen.has(partnership.brandId)) continue
    seen.add(partnership.brandId)
    const brand = catalog.find((b) => b.id === partnership.brandId)
    if (brand) brands.push(brand)
  }

  return brands
}

export function getVerifiedPartnerEventCounts(events, catalog = []) {
  const counts = new Map()

  for (const partnership of getHostPartnerships(events, catalog)) {
    counts.set(partnership.brandId, (counts.get(partnership.brandId) ?? 0) + 1)
  }

  return counts
}

/** Marcas que el host cargó en colaboraciones pasadas (portfolio manual). */
export function getSelfReportedCollabBrands(successStories = [], catalog = [], verifiedBrands = []) {
  const verifiedNames = new Set(
    verifiedBrands.map((b) => b.name?.trim().toLowerCase()).filter(Boolean),
  )
  const seen = new Set()
  const brands = []

  for (const story of successStories) {
    if (!story.title?.trim()) continue
    for (const name of story.brandNames ?? []) {
      const key = name?.trim().toLowerCase()
      if (!key || seen.has(key) || verifiedNames.has(key)) continue
      seen.add(key)
      brands.push(findBrandInCatalog(name, catalog) ?? { name, id: name })
    }
  }

  return brands
}

export function getSelfReportedCollabStories(successStories = [], verifiedBrands = []) {
  const verifiedNames = new Set(
    verifiedBrands.map((b) => b.name?.trim().toLowerCase()).filter(Boolean),
  )

  return (successStories ?? []).filter((story) => {
    if (!story.title?.trim()) return false
    const names = (story.brandNames ?? []).filter(Boolean)
    if (names.length === 0) return true
    return names.some((name) => !verifiedNames.has(name.trim().toLowerCase()))
  })
}
