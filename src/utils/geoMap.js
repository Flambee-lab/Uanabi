/** Bounds aproximados del AMBA para posicionar pines en el mapa simulado */
export const AMBA_BOUNDS = {
  north: -34.52,
  south: -34.72,
  west: -58.62,
  east: -58.33,
}

export const ZONE_PRESETS = [
  { id: 'all', label: 'Todo Buenos Aires' },
  { id: 'caba', label: 'Capital Federal', keywords: ['Capital Federal', 'CABA', 'Palermo', 'Puerto Madero', 'San Telmo', 'Villa Crespo'] },
  { id: 'oeste', label: 'GBA Oeste / Morón', keywords: ['Morón', 'Oeste', 'Haedo', 'Ituzaingó'] },
  { id: 'norte', label: 'GBA Norte', keywords: ['Norte', 'San Isidro', 'Vicente López', 'Olivos'] },
  { id: 'sur', label: 'GBA Sur', keywords: ['Sur', 'Avellaneda', 'Lanús', 'Quilmes'] },
]

export function coordsToPercent({ lat, lng }) {
  const { north, south, west, east } = AMBA_BOUNDS
  const x = ((lng - west) / (east - west)) * 100
  const y = ((lat - north) / (south - north)) * 100
  return {
    left: `${Math.min(96, Math.max(4, x))}%`,
    top: `${Math.min(94, Math.max(6, y))}%`,
  }
}

export function filterBrandsByGeo(brands, { searchQuery, zonePresetId }) {
  let list = brands

  const preset = ZONE_PRESETS.find((z) => z.id === zonePresetId)
  if (preset && preset.id !== 'all' && preset.keywords) {
    list = list.filter((b) =>
      preset.keywords.some((kw) => b.zone.toLowerCase().includes(kw.toLowerCase())),
    )
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    list = list.filter(
      (b) =>
        b.zone.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q),
    )
  }

  return list
}

export const CABA_SUGGESTIONS = [
  'Capital Federal',
  'Palermo',
  'Puerto Madero',
  'San Telmo',
  'Villa Crespo',
  'Recoleta',
  'Microcentro',
]

export function countBrandsByGeo(brands, options) {
  return filterBrandsByGeo(brands, options).length
}

export function getPinLabel(budgetType) {
  if (budgetType === 'Presupuesto Efectivo') return '$ Efectivo'
  if (budgetType === 'Canje') return 'Canje'
  return 'Híbrido'
}
