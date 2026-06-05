/**
 * Criterios de búsqueda de eventos por marca (tags amplios).
 * No es necesario cumplir todos — el match resalta coincidencias parciales.
 */
export const BRAND_EVENT_SEEK_CRITERIA = {
  'brand-001': {
    eventTypes: [
      'Festivales masivos',
      'Eventos universitarios',
      'Torneos deportivos',
      'Ferias y pop-ups',
    ],
    audience: ['Público joven', 'Familias', 'Más de 500 asistentes'],
    ageRange: ['18–35 años', 'Todo público'],
    cities: ['CABA', 'Palermo', 'Recoleta', 'San Telmo'],
    format: ['Presencial', 'Barra de bebidas'],
  },
  'brand-002': {
    eventTypes: ['Torneos de gaming', 'Eventos extremos', 'Lanzamientos urbanos', 'Música en vivo'],
    audience: ['Público 18–34', 'Comunidad adrenaline'],
    ageRange: ['18–34 años'],
    cities: ['CABA', 'Puerto Madero', 'Villa Crespo'],
    format: ['Presencial', 'Sampling en venue'],
  },
  'brand-003': {
    eventTypes: ['Maratones', 'Torneos amateur', 'Running urbano', 'Eventos universitarios'],
    audience: ['Deportistas amateur', 'Comunidad fitness'],
    ageRange: ['16–40 años'],
    cities: ['CABA', 'Villa Crespo', 'Palermo'],
    format: ['Presencial', 'Branding en cancha'],
  },
  'brand-004': {
    eventTypes: ['LAN parties', 'Conferencias tech', 'Hackathons', 'E-sports'],
    audience: ['Público tech', 'Developers y gamers'],
    ageRange: ['18–40 años'],
    cities: ['CABA', 'Microcentro', 'Palermo'],
    format: ['Presencial', 'Zona demo / expo'],
  },
  'brand-005': {
    eventTypes: ['Retiros outdoor', 'Eventos sustentables', 'Expediciones', 'Talleres naturaleza'],
    audience: ['Comunidad outdoor', 'Público consciente'],
    ageRange: ['25–55 años'],
    cities: ['CABA', 'San Telmo'],
    format: ['Presencial', 'Experiencia en campo'],
  },
  'brand-006': {
    eventTypes: ['Fiestas privadas', 'Bares y gastronomía', 'Eventos culturales'],
    audience: ['Público barrial', 'Adultos 25–45'],
    ageRange: ['21–45 años'],
    cities: ['GBA', 'CABA'],
    format: ['Presencial', 'Barra de cerveza'],
  },
  'brand-007': {
    eventTypes: ['Eventos barriales', 'Fútbol amateur', 'Encuentros locales'],
    audience: ['Comunidad local', 'Aficionados'],
    ageRange: ['18–50 años'],
    cities: ['GBA', 'CABA'],
    format: ['Presencial'],
  },
  'brand-008': {
    eventTypes: ['Activaciones digitales', 'E-sports', 'Meetups tech'],
    audience: ['Early adopters', 'Emprendedores'],
    ageRange: ['22–45 años'],
    cities: ['CABA', 'GBA Norte'],
    format: ['Híbrido', 'Stand interactivo'],
  },
  'brand-009': {
    eventTypes: ['Eventos familiares', 'Ferias gastronómicas', 'Sampling masivo'],
    audience: ['Familias', 'Público general'],
    ageRange: ['Todas las edades'],
    cities: ['GBA', 'CABA'],
    format: ['Presencial', 'Stand en feria'],
  },
  'brand-010': {
    eventTypes: ['Running', 'Deportes urbanos', 'Torneos callejeros'],
    audience: ['Runners', 'Deportistas urbanos'],
    ageRange: ['18–45 años'],
    cities: ['GBA', 'CABA'],
    format: ['Presencial'],
  },
  'brand-011': {
    eventTypes: ['Eventos corporativos', 'Lanzamientos VIP', 'Networking premium'],
    audience: ['Ejecutivos', 'Público premium'],
    ageRange: ['28–55 años'],
    cities: ['CABA', 'Recoleta', 'Puerto Madero'],
    format: ['Presencial', 'Cocktail / VIP'],
  },
  'brand-012': {
    eventTypes: ['Gaming', 'Música urbana', 'Festivales nocturnos'],
    audience: ['Gamers', 'Público nocturno 18–30'],
    ageRange: ['18–30 años'],
    cities: ['GBA', 'CABA'],
    format: ['Presencial', 'Branding escenario'],
  },
  'brand-013': {
    eventTypes: ['Eventos de bienestar', 'Activaciones en ferias', 'Lanzamientos producto'],
    audience: ['Público femenino / mixto', 'Wellness'],
    ageRange: ['20–45 años'],
    cities: ['CABA', 'Belgrano'],
    format: ['Presencial', 'Sampling skincare'],
  },
  'brand-014': {
    eventTypes: ['Conciertos íntimos', 'Festivales emergentes', 'Lanzamientos musicales'],
    audience: ['Fans de música', 'Público 18–35'],
    ageRange: ['18–35 años'],
    cities: ['CABA', 'Chacarita', 'Palermo'],
    format: ['Presencial', 'Activación con artistas'],
  },
}

/** Criterios por defecto si la marca no tiene pack propio */
export function getDefaultEventSeekCriteria(brand) {
  const types = brand?.seeks?.length
    ? [...brand.seeks]
    : ['Eventos presenciales', 'Activaciones de marca']

  return {
    eventTypes: types.slice(0, 5),
    audience: ['Público local', 'Comunidad del evento'],
    ageRange: ['18–45 años'],
    cities: ['CABA'],
    format: ['Presencial'],
  }
}

export function resolveBrandEventSeekCriteria(brand) {
  if (brand?.eventSeekCriteria) return brand.eventSeekCriteria
  return BRAND_EVENT_SEEK_CRITERIA[brand?.id] ?? getDefaultEventSeekCriteria(brand)
}
