import { getBrandScaleLabel } from './brandProfileExtras'

/** Handles reales aproximados para demo */
const BRAND_SOCIAL_BY_ID = {
  'brand-001': {
    instagram: 'https://instagram.com/cocacola',
    facebook: 'https://facebook.com/CocaCola',
    twitter: 'https://x.com/CocaCola',
    linkedin: 'https://linkedin.com/company/the-coca-cola-company',
    website: 'https://www.coca-cola.com',
  },
  'brand-002': {
    instagram: 'https://instagram.com/redbull',
    facebook: 'https://facebook.com/redbull',
    twitter: 'https://x.com/redbull',
    linkedin: 'https://linkedin.com/company/red-bull',
    website: 'https://www.redbull.com',
  },
  'brand-003': {
    instagram: 'https://instagram.com/nike',
    facebook: 'https://facebook.com/nike',
    twitter: 'https://x.com/Nike',
    linkedin: 'https://linkedin.com/company/nike',
    website: 'https://www.nike.com',
  },
  'brand-004': {
    instagram: 'https://instagram.com/samsung',
    website: 'https://www.samsung.com',
    linkedin: 'https://linkedin.com/company/samsung-electronics',
  },
  'brand-005': {
    instagram: 'https://instagram.com/patagonia',
    facebook: 'https://facebook.com/patagonia',
    website: 'https://www.patagonia.com',
  },
  'brand-006': {
    instagram: 'https://instagram.com/quilmes',
    facebook: 'https://facebook.com/Quilmes',
    website: 'https://www.quilmes.com.ar',
  },
  'brand-007': {
    instagram: 'https://instagram.com/cervezaandes',
    website: 'https://www.andes.com.ar',
  },
  'brand-008': {
    instagram: 'https://instagram.com/mercadolibre',
    linkedin: 'https://linkedin.com/company/mercadolibre',
    website: 'https://www.mercadolibre.com.ar',
  },
  'brand-009': {
    instagram: 'https://instagram.com/arcor',
    facebook: 'https://facebook.com/Arcor',
    website: 'https://www.arcor.com',
  },
  'brand-010': {
    instagram: 'https://instagram.com/adidas',
    twitter: 'https://x.com/adidas',
    website: 'https://www.adidas.com',
  },
  'brand-011': {
    instagram: 'https://instagram.com/bancogalicia',
    linkedin: 'https://linkedin.com/company/banco-galicia',
    website: 'https://www.bancogalicia.com',
  },
  'brand-012': {
    instagram: 'https://instagram.com/monsterenergy',
    facebook: 'https://facebook.com/MonsterEnergy',
    website: 'https://www.monsterenergy.com',
  },
  'brand-013': {
    instagram: 'https://instagram.com/nivea',
    facebook: 'https://facebook.com/NIVEA',
    website: 'https://www.nivea.com',
  },
  'brand-014': {
    instagram: 'https://instagram.com/spotify',
    twitter: 'https://x.com/Spotify',
    linkedin: 'https://linkedin.com/company/spotify',
    website: 'https://www.spotify.com',
  },
}

export function getBrandSizeDisplay(brand) {
  if (brand.brandSize) return brand.brandSize
  if (brand.sponsorScale === 'main') return 'Marca consolidada'
  if (brand.sponsorScale === 'micro') return 'Marca emergente'
  return getBrandScaleLabel(brand)
}

export function getBrandSocialLinks(brand) {
  if (brand.socials) return brand.socials
  return BRAND_SOCIAL_BY_ID[brand.id] ?? {}
}
