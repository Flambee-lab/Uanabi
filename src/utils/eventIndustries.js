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
