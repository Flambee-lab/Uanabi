/** Catálogo visual del wizard de invitación — VitalSport (bebidas energéticas y deportivas) */
export const VITALSPORT_BRAND = {
  id: 'brand-vitalsport',
  name: 'VitalSport',
  industry: 'Suplementos y Bebidas Deportivas',
  tagline: 'Bebidas energéticas · isotónicas · performance',
}

/** Imágenes Unsplash — latas, energéticas e isotónicas */
export const VITALSPORT_CATALOG = [
  {
    id: 'energy-classic',
    label: 'Energética Classic',
    subtitle: 'Lata 250ml · sabor original · sampling en venue',
    image:
      'https://images.unsplash.com/photo-1554866585-cd94870890b7?auto=format&fit=crop&w=600&q=80',
    accent: 'from-amber-400/30 to-orange-600/40',
  },
  {
    id: 'energy-zero',
    label: 'Energética Zero Azúcar',
    subtitle: 'Lata 250ml · zero · público fitness y gaming',
    image:
      'https://images.unsplash.com/photo-1572490122745-00852d174e72?auto=format&fit=crop&w=600&q=80',
    accent: 'from-lime-400/25 to-emerald-600/35',
  },
  {
    id: 'iso-500',
    label: 'Isotónica 500ml',
    subtitle: 'Hidratación · packs para cancha y acreditaciones',
    image:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    accent: 'from-cyan-400/30 to-blue-600/40',
  },
  {
    id: 'multipack-cans',
    label: 'Multipack de Latas',
    subtitle: '6–12 unidades · premios, influencers y prensa',
    image:
      'https://images.unsplash.com/photo-1544144943-4c147043331b?auto=format&fit=crop&w=600&q=80',
    accent: 'from-rose-400/25 to-red-600/35',
  },
  {
    id: 'energy-shots',
    label: 'Shots Energéticos',
    subtitle: 'Dosis compacta · backstage y staff del evento',
    image:
      'https://images.unsplash.com/photo-1610877246469-0babcb403393?auto=format&fit=crop&w=600&q=80',
    accent: 'from-violet-400/25 to-purple-600/35',
  },
  {
    id: 'protein-bars',
    label: 'Barras & Geles',
    subtitle: 'Pre/post evento · nutrición para atletas',
    image:
      'https://images.unsplash.com/photo-1606312619070-d48aeb4cdb78?auto=format&fit=crop&w=600&q=80',
    accent: 'from-amber-400/20 to-yellow-600/30',
  },
  {
    id: 'shakers',
    label: 'Shakers con Logo',
    subtitle: 'Co-branded · regalo para tu audiencia',
    image:
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    accent: 'from-sky-400/25 to-indigo-600/35',
  },
  {
    id: 'cooler-event',
    label: 'Cooler + Hielo',
    subtitle: 'Barra fría montada en el venue',
    image:
      'https://images.unsplash.com/photo-1625772299848-391b6a87ff7e?auto=format&fit=crop&w=600&q=80',
    accent: 'from-teal-400/20 to-cyan-600/30',
  },
  {
    id: 'cash',
    label: 'Sponsoreo en Efectivo',
    subtitle: 'Aporte directo para producción del evento',
    image:
      'https://images.unsplash.com/photo-1554224311-beee415c201f?auto=format&fit=crop&w=600&q=80',
    accent: 'from-emerald-400/20 to-teal-600/30',
  },
]

export const QUANTITY_OPTIONS = [
  { value: '100', label: 'Hasta 100 unidades' },
  { value: '300', label: '100 – 300 unidades' },
  { value: '500', label: '300 – 500 unidades' },
  { value: '500+', label: 'Más de 500 unidades' },
]

export const RECEPTION_WINDOWS = [
  { value: '08-12', label: 'Mañana · 8:00 a 12:00' },
  { value: '12-18', label: 'Tarde · 12:00 a 18:00' },
  { value: '18-22', label: 'Noche · 18:00 a 22:00' },
  { value: 'flex', label: 'Horario flexible (coordinamos por WhatsApp)' },
]

export const BRAND_REQUIREMENTS = [
  { id: 'ig-post', label: '1 Posteo en Instagram' },
  { id: 'ig-stories', label: '2 Stories en Instagram' },
  { id: 'stand', label: 'Stand físico en acreditaciones' },
  { id: 'logo-shirts', label: 'Logo en remeras oficiales' },
  { id: 'tag-marca', label: 'Tag a @VitalSport en publicaciones' },
  { id: 'foto-producto', label: '1 foto del producto en el evento' },
]

export const BRAND_OFFERS = VITALSPORT_CATALOG.map(({ id, label }) => ({ id, label }))

export function getInvitationBrandDisplay(brand) {
  if (!brand) return VITALSPORT_BRAND
  return {
    id: brand.id,
    name: brand.name,
    industry: brand.industry ?? brand.tagline ?? VITALSPORT_BRAND.industry,
    tagline: brand.industry ?? VITALSPORT_BRAND.industry,
  }
}

export function catalogLabelById(id) {
  return VITALSPORT_CATALOG.find((p) => p.id === id)?.label ?? id
}

export function requirementLabelById(id) {
  return BRAND_REQUIREMENTS.find((r) => r.id === id)?.label ?? id
}

export function quantityLabelByValue(value) {
  return QUANTITY_OPTIONS.find((q) => q.value === value)?.label ?? value
}

export function receptionLabelByValue(value) {
  return RECEPTION_WINDOWS.find((w) => w.value === value)?.label ?? value
}

export function formatWhatsAppDisplay(phone) {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3').trim()
  return phone.trim()
}

export function buildInvitationContactMessage({ brandName, whatsapp }) {
  const formatted = formatWhatsAppDisplay(whatsapp)
  return `⏳ ${brandName} revisará tu invitación y la Ficha Comercial del evento. Te van a contactar por WhatsApp${
    formatted ? ` al ${formatted}` : ''
  } dentro de los próximos 7 días hábiles para cerrar cantidades y logística — sin idas y vueltas por mail.`
}

/** Productos destacados en el panel hero (solo energéticas / isotónicas) */
export const HERO_PRODUCT_IDS = ['energy-classic', 'energy-zero', 'iso-500']
