import { NICHE_INDUSTRY_MAP } from './eventIndustries'

export const EVENT_NICHES = Object.keys(NICHE_INDUSTRY_MAP)

export const EVENT_FORMATS = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'online', label: 'Online' },
  { id: 'hibrido', label: 'Híbrido' },
]

export const COVER_GRADIENTS = [
  { id: 'aurora', class: 'from-violet-200 via-fuchsia-100 to-orange-50', label: 'Aurora' },
  { id: 'ocean', class: 'from-cyan-200 via-sky-100 to-blue-50', label: 'Océano' },
  { id: 'sunset', class: 'from-amber-100 via-rose-50 to-violet-100', label: 'Atardecer' },
  { id: 'forest', class: 'from-emerald-100 via-teal-50 to-white', label: 'Bosque' },
  { id: 'mono', class: 'from-neutral-200 via-stone-100 to-white', label: 'Minimal' },
  { id: 'neon', class: 'from-cyan-200 via-violet-100 to-fuchsia-100', label: 'Neon' },
]

export function getDefaultCreateEventForm() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    title: '',
    format: 'presencial',
    startDate: today,
    startTime: '19:00',
    endDate: today,
    endTime: '23:00',
    venueName: '',
    venueAddress: '',
    virtualLink: '',
    description: '',
    niche: 'Entretenimiento',
    capacity: '',
    coverGradientId: 'mono',
  }
}

function formatTimeRange(startTime, endTime) {
  if (!startTime && !endTime) return ''
  if (startTime && endTime) return `${startTime} – ${endTime}`
  return startTime || endTime
}

function buildLocation(form) {
  if (form.format === 'online') return 'Virtual'
  if (form.format === 'hibrido' && form.venueName) {
    return `${form.venueName} + Online`
  }
  if (form.venueAddress?.trim()) {
    return form.venueAddress.trim()
  }
  if (form.venueName?.trim()) return form.venueName.trim()
  return 'Buenos Aires'
}

export function buildEventFromForm(form, id) {
  const gradient =
    COVER_GRADIENTS.find((g) => g.id === form.coverGradientId) ?? COVER_GRADIENTS[4]
  const location = buildLocation(form)
  const venueName =
    form.format === 'online'
      ? 'Evento online'
      : form.venueName.trim() || location.split(',')[0]?.trim() || location
  const venueAddress =
    form.format === 'online'
      ? form.virtualLink.trim() || 'Enlace por confirmar'
      : form.venueAddress.trim() || location

  const audience = form.capacity.trim()
    ? `${form.capacity} personas estimadas`
    : 'Por definir'

  return {
    id,
    title: form.title.trim(),
    date: form.startDate,
    time: formatTimeRange(form.startTime, form.endTime),
    endDate: form.endDate,
    location,
    format: form.format,
    virtualLink: form.virtualLink.trim() || null,
    audience,
    capacity: form.capacity.trim() || null,
    niche: form.niche,
    matchIndustries: NICHE_INDUSTRY_MAP[form.niche] ?? ['Bebidas', 'Entretenimiento'],
    description: form.description.trim(),
    coverGradient: gradient.class,
    coverLabel: form.title.trim().slice(0, 20).toUpperCase() || 'EVENTO',
    organizer: { name: 'Host Demo', role: 'Organizador', isSuperHost: false },
    hostCommunity: {
      name: 'Uanabi — Mis eventos',
      rating: 4.5,
      reviewCount: 12,
      coverGradient: gradient.class,
    },
    venueName,
    venueAddress,
    invitedBrands: [],
    publicationStatus: 'bajado',
  }
}

export function validateCreateEventForm(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'El nombre del evento es obligatorio'
  if (!form.startDate) errors.startDate = 'Indicá la fecha de inicio'
  if (form.format !== 'online' && !form.venueName.trim() && !form.venueAddress.trim()) {
    errors.venue = 'Agregá una ubicación presencial'
  }
  if ((form.format === 'online' || form.format === 'hibrido') && !form.virtualLink.trim()) {
    errors.virtualLink = 'Agregá el enlace virtual'
  }
  if (!form.description.trim()) errors.description = 'Contá de qué se trata el evento'
  return errors
}
