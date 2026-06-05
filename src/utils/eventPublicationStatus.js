import { isEventPast } from './sponsorshipLifecycle'

/** Visibilidad del evento para marcas (independiente de la fecha). */
export const EVENT_PUBLICATION_STATUS = {
  PUBLICADO: 'publicado',
  BAJADO: 'bajado',
}

/** Estado derivado cuando la fecha del evento ya pasó. */
export const EVENT_TIMELINE_STATUS = {
  FINALIZADO: 'finalizado',
}

const DISPLAY = {
  [EVENT_PUBLICATION_STATUS.PUBLICADO]: {
    label: 'Publicado',
    badgeClass:
      'bg-blue-50 text-blue-800 ring-1 ring-blue-200/90 hover:bg-blue-100/90 focus-visible:ring-blue-300',
    interactive: true,
  },
  [EVENT_PUBLICATION_STATUS.BAJADO]: {
    label: 'Bajado',
    badgeClass:
      'bg-amber-50 text-amber-950 ring-1 ring-amber-200/90 hover:bg-amber-100/90 focus-visible:ring-amber-300',
    interactive: true,
  },
  [EVENT_TIMELINE_STATUS.FINALIZADO]: {
    label: 'Finalizado',
    badgeClass: 'bg-secondary text-muted-foreground',
    interactive: false,
  },
}

export function resolveEventPublicationStatus(event, referenceDate = new Date()) {
  if (isEventPast(event, referenceDate)) return EVENT_TIMELINE_STATUS.FINALIZADO
  const raw = event?.publicationStatus
  if (raw === EVENT_PUBLICATION_STATUS.BAJADO) return EVENT_PUBLICATION_STATUS.BAJADO
  return EVENT_PUBLICATION_STATUS.PUBLICADO
}

export function getEventPublicationDisplay(event, referenceDate = new Date()) {
  const status = resolveEventPublicationStatus(event, referenceDate)
  const meta = DISPLAY[status] ?? DISPLAY[EVENT_PUBLICATION_STATUS.PUBLICADO]
  return { status, ...meta }
}

export function getPublicationMenuActions(status) {
  if (status === EVENT_PUBLICATION_STATUS.PUBLICADO) {
    return [
      {
        id: 'bajar',
        label: 'Bajar evento',
        nextStatus: EVENT_PUBLICATION_STATUS.BAJADO,
      },
    ]
  }
  if (status === EVENT_PUBLICATION_STATUS.BAJADO) {
    return [
      {
        id: 'publicar',
        label: 'Publicar evento',
        nextStatus: EVENT_PUBLICATION_STATUS.PUBLICADO,
      },
    ]
  }
  return []
}

export function canChangePublicationStatus(event, referenceDate = new Date()) {
  return getPublicationMenuActions(resolveEventPublicationStatus(event, referenceDate)).length > 0
}
