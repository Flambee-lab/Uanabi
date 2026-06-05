import { resolveBrandEventSeekCriteria } from '../data/brandEventSeekCriteria'
import { getMatchIndustriesForEvent } from './eventIndustries'

/** Palabras clave del tag → señales en el evento del host */
const TAG_SIGNALS = {
  festival: ['festival', 'feria', 'masivo', 'expo', 'pop-up', 'popup'],
  universit: ['universit', 'campus', 'estudiant'],
  deport: ['deport', 'torneo', 'running', 'fútbol', 'futbol', 'maratón', 'maraton', 'fitness'],
  gaming: ['gaming', 'lan', 'valorant', 'esports', 'e-sport', 'game', 'torneo'],
  extrem: ['extrem', 'urban', 'action', 'adrenaline'],
  lanzamiento: ['lanzamiento', 'launch', 'estreno', 'rooftop', 'vip', 'exclusiv'],
  outdoor: ['outdoor', 'retiro', 'expedición', 'expedicion', 'sustent', 'naturaleza'],
  corporativ: ['corporativ', 'premium', 'networking', 'cocktail'],
  gastronom: ['gastronom', 'food', 'street food', 'bar', 'gastro', 'feria', 'degustación', 'degustacion', 'chef', 'cena', 'maridaje', 'foodie', 'gastronóm'],
  música: ['música', 'musica', 'concierto', 'dj', 'live', 'festival'],
  bienestar: ['bienestar', 'wellness', 'yoga', 'skincare'],
  feria: ['feria', 'stand', 'sampling', 'pop-up'],
  barrial: ['barrial', 'barrio', 'local'],
  digital: ['digital', 'tech', 'hackathon', 'conferencia', 'meetup'],
  familia: ['familia', 'familiar', 'kids', 'famili'],
  hackathon: ['hackathon', 'hack'],
  maratón: ['maratón', 'maraton', 'running', 'run'],
  caba: ['caba', 'capital federal', 'buenos aires', 'palermo', 'recoleta', 'san telmo', 'microcentro', 'puerto madero', 'villa crespo', 'belgrano', 'chacarita'],
  gba: ['gba', 'zona norte', 'zona sur', 'vicente lópez', 'san isidro'],
  presencial: ['presencial', 'venue', 'palermo', 'madero', 'konex', 'rooftop'],
  híbrido: ['híbrido', 'virtual', 'online', 'stream'],
  barra: ['barra', 'bebida', 'cerveza', 'sampling'],
  joven: ['joven', 'gaming', 'lan', 'universit', '18', '30', '34', '35'],
  '500': ['500', '120', '1000', '12k', 'masivo', 'multitud'],
  famili: ['familia', 'familiar', 'food', 'feria'],
  tech: ['tech', 'lan', 'gaming', 'digital', 'esports'],
  runner: ['running', 'run', 'maratón', 'deport'],
  vip: ['vip', 'rooftop', 'exclusiv', 'premium', 'privado'],
  nocturn: ['nocturn', 'noche', '02:00', '01:00', 'festival'],
}

const GROUP_ORDER = ['eventTypes', 'audience', 'ageRange', 'cities', 'format']

function getEventSearchBlob(event) {
  const parts = [
    event?.title,
    event?.description,
    event?.niche,
    ...(event?.matchIndustries ?? []),
    ...(getMatchIndustriesForEvent(event) ?? []),
    ...(event?.seeks ?? []),
    ...(event?.offers ?? []),
    event?.location,
    event?.venueAddress,
    event?.audience,
  ]
  return parts.filter(Boolean).join(' ').toLowerCase()
}

function tagSignalsFor(label) {
  const lower = label.toLowerCase()
  const signals = new Set()

  for (const [key, values] of Object.entries(TAG_SIGNALS)) {
    if (lower.includes(key)) values.forEach((v) => signals.add(v))
  }

  lower
    .split(/[\s,;+–\-]+/)
    .filter((w) => w.length >= 3)
    .forEach((w) => signals.add(w))

  return [...signals]
}

function parseAudienceSize(audience) {
  const text = (audience ?? '').toLowerCase()
  const presencial = text.match(/(\d[\d.,]*)\s*presencial/)
  if (presencial) {
    const n = parseInt(presencial[1].replace(/\D/g, ''), 10)
    if (!Number.isNaN(n)) return n
  }
  const plain = text.match(/(\d{3,})/)
  return plain ? parseInt(plain[1], 10) : null
}

function tagMatchesEvent(label, group, event, brand) {
  const blob = getEventSearchBlob(event)
  const signals = tagSignalsFor(label)
  const labelLower = label.toLowerCase()

  if (signals.some((s) => blob.includes(s))) return true
  if (blob.includes(labelLower)) return true

  if (group === 'cities') {
    if (labelLower.includes('caba') || labelLower === 'capital federal') {
      return /caba|capital federal|buenos aires|palermo|recoleta|san telmo|microcentro|puerto madero|villa crespo|belgrano|chacarita/i.test(
        blob,
      )
    }
    if (labelLower.includes('gba')) return true
    return signals.some((s) => blob.includes(s))
  }

  if (group === 'audience' && labelLower.includes('500')) {
    const size = parseAudienceSize(event?.audience)
    if (size != null && size >= 80) return true
  }

  if (group === 'ageRange') {
    if (labelLower.includes('todo') || labelLower.includes('todas')) return true
    if (/gaming|lan|tech|universit|concierto|nocturn/i.test(blob)) return true
  }

  if (group === 'format' && labelLower.includes('presencial')) {
    return event?.location !== 'Virtual' && !/virtual|online only/i.test(blob)
  }

  if (group === 'eventTypes') {
    return seekMatchesLegacy(label, event, brand)
  }

  return false
}

function seekMatchesLegacy(seek, event, brand) {
  const blob = getEventSearchBlob(event)
  const signals = tagSignalsFor(seek)
  if (signals.some((s) => blob.includes(s))) return true
  if (blob.includes(seek.toLowerCase())) return true

  const industryMatch =
    brand?.industry && getMatchIndustriesForEvent(event).includes(brand.industry)

  if (industryMatch) {
    const anchor = seek.toLowerCase().split(' ').find((w) => w.length >= 5)
    if (anchor && blob.includes(anchor.slice(0, 5))) return true
  }

  return false
}

function flattenCriteria(criteria) {
  const tags = []
  for (const group of GROUP_ORDER) {
    const items = criteria[group]
    if (!Array.isArray(items)) continue
    for (const label of items) {
      tags.push({ label, group })
    }
  }
  return tags
}

/** Tags amplios de tipo de evento que busca la marca */
export function getBrandEventSeekTags(brand, hostEvents = []) {
  const criteria = resolveBrandEventSeekCriteria(brand)
  const events = hostEvents ?? []

  return flattenCriteria(criteria).map(({ label, group }) => {
    const matchingEvents = events.filter((e) =>
      tagMatchesEvent(label, group, e, brand),
    )
    return {
      label,
      group,
      matched: matchingEvents.length > 0,
      matchCount: matchingEvents.length,
      matchingEventTitles: matchingEvents.map((e) => e.title),
    }
  })
}

export function hasAnySeekMatch(seekTags) {
  return seekTags.some((t) => t.matched)
}

/** @deprecated usar getBrandEventSeekTags */
export function getBrandSeekTags(brand, hostEvents = []) {
  return getBrandEventSeekTags(brand, hostEvents).map((t) => ({
    seek: t.label,
    matched: t.matched,
    matchCount: t.matchCount,
    matchingEventTitles: t.matchingEventTitles,
  }))
}

export function seekMatchesEvent(seek, event, brand) {
  return tagMatchesEvent(seek, 'eventTypes', event, brand)
}

/** Criterios de la marca que encajan con un evento concreto (para recomendaciones) */
export function getBrandSeekMatchForEvent(brand, event) {
  const tags = getBrandEventSeekTags(brand, [event])
  const matched = tags.filter((t) => t.matched)
  const industries = getMatchIndustriesForEvent(event)
  const industryMatch = Boolean(brand?.industry && industries.includes(brand.industry))

  let headline = 'Sugerida para tu nicho en CABA'
  if (matched.length === 1) {
    headline = '1 criterio de la marca encaja con este evento'
  } else if (matched.length > 1) {
    headline = `${matched.length} criterios de la marca encajan con este evento`
  } else if (industryMatch) {
    headline = `Busca eventos de ${brand.industry} — como el tuyo`
  }

  return {
    matchedTags: matched,
    matchCount: matched.length,
    industryMatch,
    headline,
  }
}

export function scoreBrandForEvent(brand, event) {
  const { matchCount, industryMatch } = getBrandSeekMatchForEvent(brand, event)
  return matchCount * 2 + (industryMatch ? 1 : 0) + (brand.matchScore ?? 0) * 0.1
}
