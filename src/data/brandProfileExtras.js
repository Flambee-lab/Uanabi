import { BRAND_PRODUCT_PACKS, getDefaultBrandProductPacks } from './brandProductPacks'



/** Fotos de activaciones para carrusel del perfil de marca */

export const DEFAULT_PARTNERSHIP_PHOTOS = [

  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',

  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',

  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',

  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',

]



export function getBrandPartnershipPhotos(brand) {

  if (brand.partnershipPhotos?.length) return brand.partnershipPhotos

  const cover = brand.coverImage

  if (cover) {

    return [cover, ...DEFAULT_PARTNERSHIP_PHOTOS.slice(0, 3)]

  }

  return DEFAULT_PARTNERSHIP_PHOTOS

}



function resolveProductPacks(brand) {

  if (brand.productPacks?.length) return brand.productPacks

  return BRAND_PRODUCT_PACKS[brand.id] ?? getDefaultBrandProductPacks(brand.id)

}



/** Packs visibles en fila (estilo Onbrand) + contador overflow */

export function getBrandProductPacks(brand) {

  const packs = resolveProductPacks(brand).map((pack, i) => ({

    ...pack,

    image: pack.image ?? (i === 0 ? brand.coverImage ?? null : null),

    label: pack.label ?? brand.name?.slice(0, 2).toUpperCase(),

  }))



  if (packs.length === 0) return { visible: [], overflowCount: 0 }



  const maxVisible = 4

  let visible = packs.slice(0, maxVisible)

  const overflowCount = Math.max(0, packs.length - (maxVisible - 1))



  if (packs.length > maxVisible && visible.length === maxVisible) {

    const last = visible[maxVisible - 1]

    visible = [

      ...visible.slice(0, -1),

      { ...last, overflowLabel: `+${packs.length - (maxVisible - 1)}` },

    ]

  }



  return { visible, overflowCount }

}



/** @deprecated usar getBrandProductPacks */

export function getBrandFeaturedProducts(brand) {

  const { visible } = getBrandProductPacks(brand)

  return visible

}



/** Hosts de ejemplo para la sección de colaboraciones (demo) */

export const DEMO_COLLABORATION_HOSTS = [

  { id: 'host-1', name: 'Neon LAN Party', handle: '@neonlanparty', verified: true },

  { id: 'host-2', name: 'Rooftop VIP BA', handle: '@rooftopvip', verified: false },

  { id: 'host-3', name: 'Feria Palermo Soho', handle: '@feriapalermo', verified: true },

  { id: 'host-4', name: 'Torneo Street FC', handle: '@streetfcba', verified: false },

  { id: 'host-5', name: 'Sunset Sessions', handle: '@sunsetsessions', verified: true },

]



export function getBrandCollaborationHosts(brand) {

  if (brand.collaborationHosts?.length) return brand.collaborationHosts

  return DEMO_COLLABORATION_HOSTS

}



export function getBrandScaleLabel(brand) {

  if (brand.sponsorScale === 'main') return 'Marca principal'

  if (brand.sponsorScale === 'micro') return 'Micro sponsor'

  return 'Sponsor activo'

}


