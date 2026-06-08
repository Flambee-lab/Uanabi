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

export const PUBLICATION_MENU_ACTION = {
  CHANGE_STATUS: 'change_status',
  DELETE: 'delete',
}

const DISPLAY = {
  [EVENT_PUBLICATION_STATUS.PUBLICADO]: {
    label: 'Publicado',
    badgeClass:
      'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100/90 focus-visible:ring-blue-300',
    interactive: true,
  },
  [EVENT_PUBLICATION_STATUS.BAJADO]: {
    label: 'Pausado',
    badgeClass:
      'border border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100/90 focus-visible:ring-amber-300',
    interactive: true,
  },
  [EVENT_TIMELINE_STATUS.FINALIZADO]: {
    label: 'Finalizado',
    badgeClass: 'border border-navbar-border bg-secondary text-muted-foreground',
    interactive: false,
  },
}

const DELETE_ACTION = {
  id: 'eliminar',
  label: 'Eliminar evento',
  action: PUBLICATION_MENU_ACTION.DELETE,
  destructive: true,
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
  const menuActions = getPublicationMenuActions(event, referenceDate)
  return {
    status,
    ...meta,
    interactive: menuActions.length > 0,
  }
}

export function getPublicationMenuActions(event, referenceDate = new Date()) {
  const status = resolveEventPublicationStatus(event, referenceDate)

  if (status === EVENT_TIMELINE_STATUS.FINALIZADO) {
    return []
  }

  if (status === EVENT_PUBLICATION_STATUS.PUBLICADO) {
    return [
      {
        id: 'pausar',
        label: 'Pausar publicación',
        action: PUBLICATION_MENU_ACTION.CHANGE_STATUS,
        nextStatus: EVENT_PUBLICATION_STATUS.BAJADO,
      },
      DELETE_ACTION,
    ]
  }

  if (status === EVENT_PUBLICATION_STATUS.BAJADO) {
    return [
      {
        id: 'publicar',
        label: 'Publicar evento',
        action: PUBLICATION_MENU_ACTION.CHANGE_STATUS,
        nextStatus: EVENT_PUBLICATION_STATUS.PUBLICADO,
      },
      DELETE_ACTION,
    ]
  }

  return []
}

export function canChangePublicationStatus(event, referenceDate = new Date()) {
  const status = resolveEventPublicationStatus(event, referenceDate)
  if (status === EVENT_TIMELINE_STATUS.FINALIZADO) return false
  return getPublicationMenuActions(event, referenceDate).some(
    (action) => action.action === PUBLICATION_MENU_ACTION.CHANGE_STATUS,
  )
}
