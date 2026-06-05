/** Categorías del search (rubroId null = Todas) */
export const EXPLORE_CATEGORY_OPTIONS = [
  {
    id: 'all',
    rubroId: null,
    label: 'Todas',
    hint: 'Todos los sponsors en Capital Federal',
    iconTone: 'violet',
  },
  {
    id: 'bebidas',
    rubroId: 'bebidas',
    label: 'Bebidas',
    hint: 'Bebidas, cerveza y energéticas',
    iconTone: 'rose',
  },
  {
    id: 'tech',
    rubroId: 'tech',
    label: 'Tech & Gaming',
    hint: 'Tecnología, gaming y digital',
    iconTone: 'sky',
  },
  {
    id: 'moda',
    rubroId: 'moda',
    label: 'Moda',
    hint: 'Indumentaria y diseño',
    iconTone: 'fuchsia',
  },
  {
    id: 'gastro',
    rubroId: 'gastro',
    label: 'Gastronomía',
    hint: 'Alimentos, snacks y gastronomía',
    iconTone: 'amber',
  },
  {
    id: 'lifestyle',
    rubroId: 'lifestyle',
    label: 'Estilo de Vida',
    hint: 'Entretenimiento y experiencias',
    iconTone: 'emerald',
  },
  {
    id: 'belleza',
    rubroId: 'belleza',
    label: 'Belleza',
    hint: 'Cosmética y cuidado personal',
    iconTone: 'pink',
  },
]

export function getExploreCategoryLabel(rubroId) {
  const match = EXPLORE_CATEGORY_OPTIONS.find((c) => c.rubroId === rubroId)
  return match?.label ?? EXPLORE_CATEGORY_OPTIONS[0].label
}

/** Rubros del panel de búsqueda → industrias en catálogo */
export const EXPLORE_RUBROS = [
  { id: 'bebidas', label: 'Bebidas', industries: ['Bebidas'] },
  { id: 'tech', label: 'Tech & Gaming', industries: ['Tecnología'] },
  { id: 'moda', label: 'Moda & Diseño', industries: ['Indumentaria'] },
  { id: 'gastro', label: 'Gastronomía', industries: ['Gastronomía'] },
  { id: 'lifestyle', label: 'Estilo de Vida', industries: ['Entretenimiento'] },
  { id: 'belleza', label: 'Belleza', industries: ['Belleza'] },
]

/** Etiquetas de rubro para cards de catálogo */
export const BRAND_CATEGORY_LABELS = {
  Bebidas: 'Bebidas',
  Tecnología: 'Tech & Gaming',
  Indumentaria: 'Moda',
  Gastronomía: 'Gastronomía',
  Entretenimiento: 'Entretenimiento',
  Belleza: 'Belleza',
}

const INDUSTRY_TO_RUBRO = {
  Bebidas: 'bebidas',
  Tecnología: 'tech',
  Indumentaria: 'moda',
  Gastronomía: 'gastro',
  Entretenimiento: 'lifestyle',
  Belleza: 'belleza',
}

/** Label de tag → rubro del search */
export const TAG_LABEL_TO_RUBRO = {
  Bebidas: 'bebidas',
  'Tech & Gaming': 'tech',
  Moda: 'moda',
  Gastronomía: 'gastro',
  Entretenimiento: 'lifestyle',
  'Estilo de Vida': 'lifestyle',
  Belleza: 'belleza',
}

export function getBrandCategoryTags(brand, max = 3) {
  const tags = []
  if (brand.industry) {
    tags.push(BRAND_CATEGORY_LABELS[brand.industry] ?? brand.industry)
  }
  if (Array.isArray(brand.categories)) {
    for (const c of brand.categories) {
      if (c && !tags.includes(c)) tags.push(c)
    }
  }
  return tags.slice(0, max)
}

export function getBrandRubroIds(brand) {
  const ids = new Set()
  const fromIndustry = INDUSTRY_TO_RUBRO[brand.industry]
  if (fromIndustry) ids.add(fromIndustry)
  for (const tag of getBrandCategoryTags(brand, 10)) {
    const rubro = TAG_LABEL_TO_RUBRO[tag]
    if (rubro) ids.add(rubro)
  }
  return ids
}

const CABA_KEYWORDS = [
  'capital federal',
  'caba',
  'palermo',
  'puerto madero',
  'san telmo',
  'villa crespo',
  'recoleta',
  'microcentro',
  'belgrano',
  'chacarita',
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
  { searchQuery = '', rubros = [] } = {},
) {
  let list = brands.filter(isBrandInCaba)

  if (rubros.length > 0) {
    list = list.filter((b) =>
      rubros.some((rubroId) => getBrandRubroIds(b).has(rubroId)),
    )
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q) ||
        getBrandCategoryTags(b, 10).some((t) => t.toLowerCase().includes(q)) ||
        (b.categories ?? []).some((c) => c.toLowerCase().includes(q)) ||
        b.seeks.some((s) => s.toLowerCase().includes(q)) ||
        b.offers.some((o) => o.toLowerCase().includes(q)),
    )
  }

  return list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
}

export function togglePill(current, id) {
  return current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
}

export function hasActiveExploreFilters({ searchQuery, rubros }) {
  return searchQuery.trim() !== '' || rubros.length > 0
}
