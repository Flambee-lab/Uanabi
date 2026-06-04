/** Rubros del panel de búsqueda → industrias en catálogo */
export const EXPLORE_RUBROS = [
  { id: 'bebidas', label: 'Bebidas', industries: ['Bebidas'] },
  { id: 'tech', label: 'Tech & Gaming', industries: ['Tecnología'] },
  { id: 'moda', label: 'Moda & Diseño', industries: ['Indumentaria'] },
  { id: 'gastro', label: 'Gastronomía', industries: ['Gastronomía'] },
  { id: 'lifestyle', label: 'Estilo de Vida', industries: ['Entretenimiento'] },
  { id: 'belleza', label: 'Belleza', industries: ['Belleza'] },
]

export const EXPLORE_FORMATS = [
  { id: 'canje', label: 'Canje de producto', budgetTypes: ['Canje'] },
  {
    id: 'efectivo',
    label: 'Presupuesto Efectivo',
    budgetTypes: ['Presupuesto Efectivo'],
  },
  {
    id: 'hibrido',
    label: 'Híbrido (Producto + Fee)',
    budgetTypes: ['Híbrido'],
  },
]

export const EXPLORE_SCALES = [
  { id: 'micro', label: 'Micro-Sponsor' },
  { id: 'main', label: 'Main Sponsor' },
  { id: 'regalos', label: 'Regalos Corporativos' },
]

const CABA_KEYWORDS = [
  'capital federal',
  'caba',
  'palermo',
  'puerto madero',
  'san telmo',
  'villa crespo',
  'recoleta',
  'microcentro',
]

export function isBrandInCaba(brand) {
  const zone = (brand.zone ?? '').toLowerCase()
  return CABA_KEYWORDS.some((kw) => zone.includes(kw))
}

/** micro | main | regalos */
export function getSponsorScale(brand) {
  if (brand.sponsorScale) return brand.sponsorScale
  if (brand.budgetType === 'Presupuesto Efectivo') return 'main'
  if (brand.budgetType === 'Canje') return 'regalos'
  return 'micro'
}

export function filterExploreBrands(
  brands,
  { searchQuery = '', rubros = [], formats = [], scales = [] } = {},
) {
  let list = brands.filter(isBrandInCaba)

  if (rubros.length > 0) {
    const industries = new Set(
      rubros.flatMap(
        (id) => EXPLORE_RUBROS.find((r) => r.id === id)?.industries ?? [],
      ),
    )
    list = list.filter((b) => industries.has(b.industry))
  }

  if (formats.length > 0) {
    const types = new Set(
      formats.flatMap(
        (id) => EXPLORE_FORMATS.find((f) => f.id === id)?.budgetTypes ?? [],
      ),
    )
    list = list.filter((b) => types.has(b.budgetType))
  }

  if (scales.length > 0) {
    list = list.filter((b) => scales.includes(getSponsorScale(b)))
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q) ||
        b.seeks.some((s) => s.toLowerCase().includes(q)) ||
        b.offers.some((o) => o.toLowerCase().includes(q)),
    )
  }

  return list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
}

export function togglePill(current, id) {
  return current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
}

export function hasActiveExploreFilters({ searchQuery, rubros, formats, scales }) {
  return (
    searchQuery.trim() !== '' ||
    rubros.length > 0 ||
    formats.length > 0 ||
    scales.length > 0
  )
}
