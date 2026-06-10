import {
  APPROVED_BANNER_DISMISS_KEY_PREFIX,
  DECLINED_STATUS_LABEL,
  getProductDeliveryByLabel,
  isDeclinedStatus,
  SPONSORSHIP_STATUS,
} from './sponsorshipLifecycle'

export const INLINE_NOTIF_DISMISS_KEY_PREFIX = 'uanabi-event-inline-notif-v2-'

const NOTIFIABLE_STATUSES = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.DECLINADO,
  SPONSORSHIP_STATUS.RECHAZADO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
  SPONSORSHIP_STATUS.CASO_ABIERTO,
])

const TYPE_BY_STATUS = {
  [SPONSORSHIP_STATUS.MATCH_ACEPTADO]: 'approved',
  [SPONSORSHIP_STATUS.DECLINADO]: 'declined',
  [SPONSORSHIP_STATUS.RECHAZADO]: 'declined',
  [SPONSORSHIP_STATUS.EN_VERIFICACION]: 'verifying',
  [SPONSORSHIP_STATUS.CASO_ABIERTO]: 'case_open',
}

export const INLINE_NOTIFICATION_TYPE_LABELS = {
  approved: 'Aprobación',
  declined: DECLINED_STATUS_LABEL,
  verifying: 'Verificación',
  case_open: 'Acción',
  in_review: 'Invitación',
}

export const INLINE_NOTIFICATION_ACCENT_CLASS = {
  approved: 'bg-emerald-500',
  declined: 'bg-orange-400',
  verifying: 'bg-violet-500',
  case_open: 'bg-orange-500',
  in_review: 'bg-amber-500',
}

export const INLINE_NOTIFICATION_BADGE_CLASS = {
  approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/90',
  declined: 'bg-orange-50 text-orange-800/90 ring-1 ring-orange-200/90',
  verifying: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/90',
  case_open: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/90',
  in_review: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/90',
}

export const INLINE_NOTIFICATION_ROW_CLASS = {
  approved: 'bg-emerald-50/40 hover:bg-emerald-50/70',
  declined: 'bg-orange-50/35 hover:bg-orange-50/55',
  verifying: 'bg-violet-50/40 hover:bg-violet-50/65',
  case_open: 'bg-orange-50/45 hover:bg-orange-50/70',
  in_review: 'bg-amber-50/40 hover:bg-amber-50/65',
}

const STATUS_TO_VISUAL = {
  match_aceptado: 'approved',
  declinado: 'declined',
  rechazado: 'declined',
  en_verificacion: 'verifying',
  caso_abierto: 'case_open',
  en_revision: 'in_review',
}

const NAVBAR_TYPE_TO_VISUAL = {
  match: 'approved',
  declined: 'declined',
  invite: 'in_review',
  suggestion: 'verifying',
  event: 'case_open',
}

/** Paleta compartida entre cards de evento, sidebar y centro de notificaciones. */
export function resolveNotificationVisual(notif) {
  if (notif?.invitationStatus && STATUS_TO_VISUAL[notif.invitationStatus]) {
    return STATUS_TO_VISUAL[notif.invitationStatus]
  }
  return NAVBAR_TYPE_TO_VISUAL[notif?.type] ?? 'in_review'
}

export function getInlineNotificationBadgeClass(type) {
  return INLINE_NOTIFICATION_BADGE_CLASS[type] ?? INLINE_NOTIFICATION_BADGE_CLASS.in_review
}

export function getInlineNotificationDotClass(type) {
  return INLINE_NOTIFICATION_ACCENT_CLASS[type] ?? INLINE_NOTIFICATION_ACCENT_CLASS.in_review
}

export function getInlineNotificationRowClass(type, read = false) {
  if (read) return 'hover:bg-secondary/60'
  return INLINE_NOTIFICATION_ROW_CLASS[type] ?? INLINE_NOTIFICATION_ROW_CLASS.in_review
}

export function getInlineNotificationTypeLabel(type, fallback = 'Novedad') {
  return INLINE_NOTIFICATION_TYPE_LABELS[type] ?? fallback
}

export function getUnreadBrandNotificationsMap(notifications = []) {
  return new Map(notifications.map((notif) => [notif.brandId, notif.type]))
}

export function getInlineNotificationId(brandId, status) {
  return `${brandId}-${status}`
}

function dismissKey(eventId, notificationId) {
  return `${INLINE_NOTIF_DISMISS_KEY_PREFIX}${eventId}-${notificationId}`
}

export function isInlineNotificationDismissed(eventId, notificationId) {
  if (!eventId || !notificationId || typeof window === 'undefined') return false
  return window.localStorage.getItem(dismissKey(eventId, notificationId)) === '1'
}

export function dismissInlineNotification(eventId, notificationId) {
  if (!eventId || !notificationId || typeof window === 'undefined') return
  window.localStorage.setItem(dismissKey(eventId, notificationId), '1')
}

/** Restaura la marca inline al entrar desde el centro de notificaciones. */
export function restoreInlineNotification(eventId, brandId, status) {
  if (!eventId || !brandId || !status || typeof window === 'undefined') return
  window.localStorage.removeItem(dismissKey(eventId, getInlineNotificationId(brandId, status)))
}

export function getDismissedInlineNotificationIds(eventId) {
  if (!eventId || typeof window === 'undefined') return new Set()
  const prefix = `${INLINE_NOTIF_DISMISS_KEY_PREFIX}${eventId}-`
  const dismissed = new Set()

  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i)
    if (key?.startsWith(prefix) && window.localStorage.getItem(key) === '1') {
      dismissed.add(key.slice(prefix.length))
    }
  }

  return dismissed
}

/** Migra el dismiss del banner negro legacy a notificaciones inline por marca. */
export function migrateLegacyApprovedBannerDismiss(eventId, invitedBrands = []) {
  if (!eventId || typeof window === 'undefined') return
  const legacyKey = `${APPROVED_BANNER_DISMISS_KEY_PREFIX}${eventId}`
  if (window.localStorage.getItem(legacyKey) !== '1') return

  invitedBrands.forEach((brand) => {
    if (brand.invitationStatus === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
      dismissInlineNotification(eventId, getInlineNotificationId(brand.id, brand.invitationStatus))
    }
  })
}

function formatRelativeDate(isoDate, now = new Date()) {
  if (!isoDate) return ''
  const then = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(then.getTime())) return ''

  const diffDays = Math.floor((now - then) / 86_400_000)
  if (diffDays < 1) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} d`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`
  return then.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function buildNotificationContent(brand, status, event) {
  const name = brand.name ?? 'La marca'
  const productDeliveryBy = event ? getProductDeliveryByLabel(event) : null

  switch (status) {
    case SPONSORSHIP_STATUS.MATCH_ACEPTADO:
      return {
        type: 'approved',
        title: `${name} aprobó tu evento`,
        body: productDeliveryBy
          ? `Te contactamos para coordinar el envío de productos (objetivo: ${productDeliveryBy}).`
          : 'Te contactamos para coordinar el envío de productos.',
      }
    case SPONSORSHIP_STATUS.DECLINADO:
    case SPONSORSHIP_STATUS.RECHAZADO:
      return {
        type: 'declined',
        title: `${name} no está disponible esta vez`,
        body: 'Explorá marcas similares en la pestaña Recomendadas para seguir buscando patrocinio.',
      }
    case SPONSORSHIP_STATUS.EN_VERIFICACION:
      return {
        type: 'verifying',
        title: `${name} está en verificación`,
        body: 'Revisamos el cumplimiento del acuerdo antes de cerrar el patrocinio.',
      }
    case SPONSORSHIP_STATUS.CASO_ABIERTO:
      return {
        type: 'case_open',
        title: `Cerrá el patrocinio con ${name}`,
        body: 'El evento finalizó — completá el cierre del caso en la card de la marca.',
      }
    default:
      return null
  }
}

export function getEventInlineNotifications(event, invitedBrands = [], dismissedIds = null) {
  if (!event?.id) return []

  const dismissed =
    dismissedIds instanceof Set ? dismissedIds : getDismissedInlineNotificationIds(event.id)

  return invitedBrands
    .filter(
      (brand) =>
        (NOTIFIABLE_STATUSES.has(brand.invitationStatus) || isDeclinedStatus(brand.invitationStatus)) &&
        (brand.statusChangedAt || brand.invitedAt),
    )
    .map((brand) => {
      const status = brand.invitationStatus
      const id = getInlineNotificationId(brand.id, status)
      const content = buildNotificationContent(brand, status, event)
      if (!content) return null

      return {
        id,
        brandId: brand.id,
        status,
        type: TYPE_BY_STATUS[status] ?? content.type,
        typeLabel:
          INLINE_NOTIFICATION_TYPE_LABELS[TYPE_BY_STATUS[status] ?? content.type] ?? 'Novedad',
        title: content.title,
        body: content.body,
        time: formatRelativeDate(brand.statusChangedAt ?? brand.invitedAt),
        dismissed: dismissed.has(id),
      }
    })
    .filter(Boolean)
    .filter((notif) => !notif.dismissed)
    .sort((a, b) => {
      const priority = { case_open: 0, approved: 1, verifying: 2, declined: 3 }
      return (priority[a.type] ?? 9) - (priority[b.type] ?? 9)
    })
}

export function getVisibleApprovalBrandIds(event, invitedBrands = [], dismissedIds = null) {
  return new Set(
    getEventInlineNotifications(event, invitedBrands, dismissedIds)
      .filter((notif) => notif.type === 'approved')
      .map((notif) => notif.brandId),
  )
}

export function dismissAllEventInlineNotifications(event, invitedBrands = []) {
  if (!event?.id) return
  getEventInlineNotifications(event, invitedBrands).forEach((notif) => {
    dismissInlineNotification(event.id, notif.id)
  })
}

