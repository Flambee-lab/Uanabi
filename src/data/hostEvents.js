export const hostEvents = [
  {
    id: 'evt-001',
    title: 'Neon LAN Party — Torneo Valorant',
    socialLink: 'https://instagram.com/neonlanparty',
    location: 'Palermo, Buenos Aires',
    isVirtual: false,
    audience: '120 presenciales / 12k reach',
    offers: ['Mención en stream', 'Banner en escenario', 'Fotos para redes'],
    seeks: ['Canje de producto', 'Presupuesto en efectivo'],
  },
  {
    id: 'evt-002',
    title: 'Rooftop Privado — Lanzamiento Exclusivo',
    socialLink: 'https://linktr.ee/rooftopvip',
    location: 'Puerto Madero, Buenos Aires',
    isVirtual: false,
    audience: '25 presenciales / 850 reach',
    offers: ['Stories del host', 'Product placement en barra'],
    seeks: ['Canje premium', 'Experiencia exclusiva'],
  },
]

export const EMPTY_EVENT_FORM = {
  title: '',
  socialLink: '',
  location: '',
  isVirtual: false,
  audience: '',
  offers: '',
  seeks: '',
}

/** Evento mínimo del formulario rápido → fila en Mis Eventos */
export function buildHostEventFromQuickForm(event) {
  return {
    id: event.id,
    title: event.title,
    date: new Date().toISOString().slice(0, 10),
    location: event.location,
    audience: event.audience,
    socialLink: event.socialLink,
    offers: event.offers ?? [],
    seeks: event.seeks ?? [],
    niche: 'Entretenimiento',
    matchIndustries: ['Bebidas', 'Entretenimiento'],
    description:
      'Describí tu evento: qué experiencia ofrecés, quién es tu audiencia y qué tipo de sponsors buscás.',
    coverGradient: 'from-neutral-200 via-stone-100 to-white',
    time: '19:00',
    organizer: { name: 'Host Demo', role: 'Organizador' },
    invitedBrands: [],
  }
}

export function createEventFromForm(form) {
  return {
    id: `evt-${Date.now()}`,
    title: form.title.trim(),
    socialLink: form.socialLink.trim(),
    location: form.isVirtual ? 'Virtual' : form.location.trim(),
    isVirtual: form.isVirtual,
    audience: form.audience.trim(),
    offers: form.offers
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
    seeks: form.seeks
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
  }
}

export function createApplicationFromSubmission(brand, event) {
  return {
    id: `app-${Date.now()}`,
    brandName: brand.name,
    brandLogo: brand.logo,
    budgetType: brand.budgetType,
    eventTarget: event.title,
    date: new Date().toISOString().slice(0, 10),
    status: 'pendiente',
  }
}
