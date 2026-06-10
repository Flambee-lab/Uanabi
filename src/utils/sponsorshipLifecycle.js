import { formatEventDateShort } from './eventDetailFormat'

/** Estados del ciclo de vida de un patrocinio por evento × marca */
export const SPONSORSHIP_STATUS = {
  INVITACION_ENVIADA: 'invitacion_enviada',
  MATCH_ACEPTADO: 'match_aceptado',
  DECLINADO: 'declinado',
  RECHAZADO: 'rechazado',
  CASO_ABIERTO: 'caso_abierto',
  EN_VERIFICACION: 'en_verificacion_admin',
}

export const DECLINED_STATUS_LABEL = 'No disponible esta vez'

export function isDeclinedStatus(status) {
  return status === SPONSORSHIP_STATUS.DECLINADO || status === SPONSORSHIP_STATUS.RECHAZADO
}

/** Pasos del recorrido host → marca (labels cortos para el timeline) */
export const INVITATION_TIMELINE_STEPS = [
  { id: 'revision', label: 'En revisión' },
  { id: 'respuesta', label: 'Respuesta', dynamic: true },
  { id: 'productos', label: 'Productos' },
  { id: 'verificacion', label: 'Verificación' },
]

const IN_REVIEW_STATUSES = new Set([
  SPONSORSHIP_STATUS.INVITACION_ENVIADA,
  'invitacion_enviada',
  'invitada',
])

const IN_REVIEW_BADGE_CLASS = 'bg-amber-50 text-amber-700 border-amber-200'

export const INVITATION_RESPONSE_DAYS = 7

export function isInvitationInReview(status) {
  return IN_REVIEW_STATUSES.has(status)
}

export function getInvitationResponseDeadline(invitedAt) {
  if (!invitedAt) return null
  const parsed = new Date(`${invitedAt}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return null
  parsed.setDate(parsed.getDate() + INVITATION_RESPONSE_DAYS)
  return formatEventDateShort(parsed.toISOString().slice(0, 10))
}

const APPROVED_STATUSES = new Set([
  SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  SPONSORSHIP_STATUS.CASO_ABIERTO,
  SPONSORSHIP_STATUS.EN_VERIFICACION,
])

const INVITE_SORT_ORDER = {
  [SPONSORSHIP_STATUS.CASO_ABIERTO]: 0,
  [SPONSORSHIP_STATUS.INVITACION_ENVIADA]: 1,
  invitada: 2,
  [SPONSORSHIP_STATUS.MATCH_ACEPTADO]: 3,
  [SPONSORSHIP_STATUS.EN_VERIFICACION]: 4,
  [SPONSORSHIP_STATUS.DECLINADO]: 5,
  [SPONSORSHIP_STATUS.RECHAZADO]: 5,
}

export const APPROVED_BANNER_DISMISS_KEY_PREFIX = 'uanabi-approved-banner-dismissed-'

export function isApprovedBannerDismissed(eventId) {
  if (!eventId || typeof window === 'undefined') return false
  return window.localStorage.getItem(`${APPROVED_BANNER_DISMISS_KEY_PREFIX}${eventId}`) === '1'
}

export function dismissApprovedBanner(eventId) {
  if (!eventId || typeof window === 'undefined') return
  window.localStorage.setItem(`${APPROVED_BANNER_DISMISS_KEY_PREFIX}${eventId}`, '1')
}

export const INVITATION_STATUS_BADGE_LABELS = {
  [SPONSORSHIP_STATUS.INVITACION_ENVIADA]: 'En revisión',
  invitada: 'En revisión',
  [SPONSORSHIP_STATUS.MATCH_ACEPTADO]: 'Aprobada',
  [SPONSORSHIP_STATUS.DECLINADO]: DECLINED_STATUS_LABEL,
  [SPONSORSHIP_STATUS.RECHAZADO]: DECLINED_STATUS_LABEL,
  [SPONSORSHIP_STATUS.CASO_ABIERTO]: 'Por validar',
  [SPONSORSHIP_STATUS.EN_VERIFICACION]: 'En verificación',
}

export function getInvitationStatusBadgeLabel(status) {
  return INVITATION_STATUS_BADGE_LABELS[status] ?? 'En proceso'
}

/** @deprecated Usar getInvitationStepExplanation */
export const INVITATION_SENT_COPY =
  '⏳ Propuesta enviada con éxito. La marca revisará la Ficha Comercial de tu evento. Te estarán contactando directamente a tu WhatsApp dentro de los próximos 7 días hábiles.'

export function parseEventDate(event) {
  if (!event?.date) return null
  const parsed = new Date(`${event.date}T23:59:59`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function isEventPast(event, referenceDate = new Date()) {
  const end = parseEventDate(event)
  if (!end) return false
  const ref = new Date(referenceDate)
  ref.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return end < ref
}

export function inviteNeedsClosure(invite, event) {
  if (!invite || !isEventPast(event)) return false
  return invite.status === SPONSORSHIP_STATUS.CASO_ABIERTO
}

export function getPendingClosureCases(events, catalog = []) {
  const cases = []
  for (const event of events ?? []) {
    if (!isEventPast(event)) continue
    for (const invite of event.invitedBrands ?? []) {
      if (!inviteNeedsClosure(invite, event)) continue
      const brand = catalog.find((b) => b.id === invite.brandId)
      cases.push({
        eventId: event.id,
        eventTitle: event.title,
        brandId: invite.brandId,
        brandName: brand?.name ?? 'Marca',
        invite,
      })
    }
  }
  return cases
}

export function getProductDeliveryByLabel(event) {
  if (!event?.date) return null
  const eventDate = new Date(`${event.date}T12:00:00`)
  if (Number.isNaN(eventDate.getTime())) return null
  eventDate.setDate(eventDate.getDate() - 7)
  const iso = eventDate.toISOString().slice(0, 10)
  return formatEventDateShort(iso)
}

export function sortInvitedBrands(brands = []) {
  return [...brands].sort((a, b) => {
    const orderA = INVITE_SORT_ORDER[a.invitationStatus] ?? 99
    const orderB = INVITE_SORT_ORDER[b.invitationStatus] ?? 99
    if (orderA !== orderB) return orderA - orderB
    return (a.name ?? '').localeCompare(b.name ?? '', 'es')
  })
}

export function getApprovedInvitedBrands(brands = []) {
  return brands.filter((b) => b.invitationStatus === SPONSORSHIP_STATUS.MATCH_ACEPTADO)
}

export function getInvitedBrandsSummary(brands = []) {
  const summary = {
    total: brands.length,
    pending: 0,
    approved: 0,
    toClose: 0,
    verifying: 0,
    declined: 0,
  }

  for (const brand of brands) {
    const status = brand.invitationStatus
    if (
      status === SPONSORSHIP_STATUS.INVITACION_ENVIADA ||
      status === 'invitada'
    ) {
      summary.pending += 1
    } else if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
      summary.approved += 1
    } else if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) {
      summary.toClose += 1
    } else if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) {
      summary.verifying += 1
    } else if (isDeclinedStatus(status)) {
      summary.declined += 1
    }
  }

  return summary
}

/**
 * @returns {{ variant: 'active' | 'declined' | 'complete', activeIndex: number, completedThrough: number, substate?: string }}
 */
export function getInvitationTimelineProgress(status, { isPastEvent = false } = {}) {
  if (isDeclinedStatus(status)) {
    return { variant: 'declined', activeIndex: 1, completedThrough: 0 }
  }

  if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) {
    return { variant: 'complete', activeIndex: 3, completedThrough: 3, substate: 'verifying' }
  }

  let activeIndex = 0
  if (
    status === SPONSORSHIP_STATUS.INVITACION_ENVIADA ||
    status === 'invitacion_enviada' ||
    status === 'invitada'
  ) {
    activeIndex = 0
  } else if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
    activeIndex = isPastEvent ? 3 : 2
  } else if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) {
    activeIndex = 3
  }

  return {
    variant: 'active',
    activeIndex,
    completedThrough: Math.max(0, activeIndex - 1),
  }
}

/** Label del paso 2 (decisión) según resolución; el resto usa el label fijo del paso */
export function getInvitationTimelineStepLabel(stepIndex, status) {
  const step = INVITATION_TIMELINE_STEPS[stepIndex]
  if (!step) return ''

  if (stepIndex === 1) {
    if (isDeclinedStatus(status)) return DECLINED_STATUS_LABEL
    if (APPROVED_STATUSES.has(status)) return 'Aprobada'
    return 'Respuesta'
  }

  return step.label
}

/**
 * @returns {'future' | 'done' | 'doneApproved' | 'active' | 'declined'}
 */
export function getInvitationTimelineStepState(stepIndex, status, progress) {
  const { variant, activeIndex } = progress

  let baseState
  if (variant === 'declined') {
    if (stepIndex < activeIndex) baseState = 'done'
    else if (stepIndex === activeIndex) baseState = 'declined'
    else baseState = 'future'
  } else if (variant === 'complete') {
    if (stepIndex < activeIndex) baseState = 'done'
    else if (stepIndex === activeIndex) baseState = 'active'
    else baseState = 'future'
  } else if (stepIndex < activeIndex) {
    baseState = 'done'
  } else if (stepIndex === activeIndex) {
    baseState = 'active'
  } else {
    baseState = 'future'
  }

  if (
    baseState === 'done' &&
    stepIndex === 1 &&
    getInvitationTimelineStepLabel(1, status) === 'Aprobada'
  ) {
    return 'doneApproved'
  }

  return baseState
}

function joinPanelSentences(parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * @returns {{ tone: string, title: string, body: string }}
 */
export function getInvitationStepPanelContent(
  status,
  {
    isPastEvent = false,
    productDeliveryBy = null,
    invitedAt = null,
    approvedBannerVisible = false,
  } = {},
) {
  const invitedLine = invitedAt
    ? `Invitación: ${formatEventDateShort(invitedAt)}.`
    : null

  if (isDeclinedStatus(status)) {
    return {
      tone: 'declined',
      title: DECLINED_STATUS_LABEL,
      body: 'La marca no puede patrocinar en estas fechas. Podés explorar otras opciones similares para tu evento.',
    }
  }

  if (isInvitationInReview(status)) {
    const deadline = getInvitationResponseDeadline(invitedAt)
    return {
      tone: 'review',
      title: 'En revisión',
      body: joinPanelSentences([
        'La marca revisa tu evento. Te avisamos cuando responda.',
        deadline
          ? `Plazo: ${deadline}. Sin respuesta en ${INVITATION_RESPONSE_DAYS} días → rechazada.`
          : `Sin respuesta en ${INVITATION_RESPONSE_DAYS} días → rechazada.`,
        invitedLine,
      ]),
    }
  }

  if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
    if (isPastEvent) {
      return {
        tone: 'close',
        title: 'Por cerrar',
        body: joinPanelSentences([
          'Evento finalizado. Subí fotos del patrocinio para cerrar el caso.',
          invitedLine,
        ]),
      }
    }

    const deliveryLine = productDeliveryBy
      ? `Uanabi coordina productos (objetivo: ${productDeliveryBy}).`
      : 'Uanabi coordina el envío de productos.'

    return {
      tone: 'approved',
      title: 'Aprobada',
      body: joinPanelSentences([
        approvedBannerVisible ? 'Aprobada. Coordinación en curso.' : 'Aprobada.',
        deliveryLine,
        invitedLine,
      ]),
    }
  }

  if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) {
    return {
      tone: 'close',
      title: 'Validar participación',
      body: joinPanelSentences([
        'Confirmá que la marca participó en tu evento.',
        'Subí fotos del stand o activación y una reseña breve — con eso validamos el patrocinio y lo publicamos en tu perfil.',
        invitedLine,
      ]),
    }
  }

  if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) {
    return {
      tone: 'verification',
      title: 'En verificación',
      body: joinPanelSentences([
        'Verificando el patrocinio. Cuando confirmemos, aparece en tu perfil.',
        invitedLine,
      ]),
    }
  }

  return {
    tone: 'review',
    title: 'En proceso',
    body: joinPanelSentences(['Seguimos tu invitación con esta marca.', invitedLine]),
  }
}

/** @deprecated Usar getInvitationStepPanelContent */
export function getInvitationStepExplanation(status, options = {}) {
  return getInvitationStepPanelContent(status, options).body
}

export function getInvitationBadgeClass(status) {
  if (isInvitationInReview(status)) {
    return IN_REVIEW_BADGE_CLASS
  }
  if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) {
    return 'bg-sky-50 text-sky-700 border-sky-100'
  }
  if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) {
    return 'bg-orange-50 text-orange-700 border-orange-100'
  }
  if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (isDeclinedStatus(status)) {
    return 'bg-orange-50/90 text-orange-800/90 border-orange-100'
  }
  return 'bg-secondary text-muted-foreground border-border-subtle'
}
