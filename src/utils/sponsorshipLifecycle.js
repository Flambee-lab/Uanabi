import { formatEventDateShort } from './eventDetailFormat'

/** Estados del ciclo de vida de un patrocinio por evento × marca */
export const SPONSORSHIP_STATUS = {
  INVITACION_ENVIADA: 'invitacion_enviada',
  MATCH_ACEPTADO: 'match_aceptado',
  DECLINADO: 'declinado',
  CASO_ABIERTO: 'caso_abierto',
  EN_VERIFICACION: 'en_verificacion_admin',
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
  [SPONSORSHIP_STATUS.DECLINADO]: 'Rechazada',
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

/** Post-evento: el host debe subir pruebas de uso de productos. */
export function inviteNeedsHostVerificationUpload(invite, event) {
  if (!invite || !isEventPast(event)) return false
  return (
    invite.status === SPONSORSHIP_STATUS.CASO_ABIERTO ||
    invite.status === SPONSORSHIP_STATUS.MATCH_ACEPTADO
  )
}

export function countPastEventInvitesNeedingHostAction(event, referenceDate = new Date()) {
  if (!event || !isEventPast(event, referenceDate)) return 0
  return (event.invitedBrands ?? []).filter((inv) =>
    inviteNeedsHostVerificationUpload(inv, event),
  ).length
}

export function formatVerificationAttentionMessage(count, singleBrandName) {
  if (count <= 0) return null
  if (count === 1) return `Verificación · ${singleBrandName}`
  return `Verificación · ${count} marcas`
}

export function formatVerificationStatusLine(count) {
  if (count <= 0) return null
  if (count === 1) return 'Verificación'
  return `Verificación · ${count} marcas`
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
    } else if (status === SPONSORSHIP_STATUS.DECLINADO) {
      summary.declined += 1
    }
  }

  return summary
}

/**
 * @returns {{ variant: 'active' | 'declined' | 'complete', activeIndex: number, completedThrough: number, substate?: string }}
 */
export function getInvitationTimelineProgress(status, { isPastEvent = false } = {}) {
  if (status === SPONSORSHIP_STATUS.DECLINADO) {
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
    if (status === SPONSORSHIP_STATUS.DECLINADO) return 'Rechazada'
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

/** Fases visibles para el host (pre y post evento). Opcional en invite.hostPhase */
export const HOST_SPONSORSHIP_PHASE = {
  ACCEPTED: 'accepted',
  IN_CONVERSATION: 'in_conversation',
  IN_TRANSIT: 'in_transit',
  READY: 'ready',
  UPLOAD_PROOFS: 'upload_proofs',
  VERIFYING: 'verifying',
  VALIDATED: 'validated',
}

const HOST_PHASE_PRESENTATION = {
  [HOST_SPONSORSHIP_PHASE.ACCEPTED]: {
    title: 'Solicitud aceptada',
    subtitle: 'Te contactamos en las próx. 24 hs',
    detail:
      'Uanabi te escribe por WhatsApp en las próximas 24 hs para coordinar el patrocinio con la marca.',
    tone: 'approved',
  },
  [HOST_SPONSORSHIP_PHASE.IN_CONVERSATION]: {
    title: 'En conversación',
    subtitle: 'Ultimando detalles del acuerdo',
    detail: 'Estamos cerrando el acuerdo con la marca. Te avisamos si necesitamos algo de tu lado.',
    tone: 'approved',
  },
  [HOST_SPONSORSHIP_PHASE.IN_TRANSIT]: {
    title: 'En camino',
    subtitle: 'Avisanos apenas te lleguen los productos',
    detail:
      'Los productos de la marca están en camino. Cuando los recibas, avisanos por WhatsApp.',
    tone: 'attention',
  },
  [HOST_SPONSORSHIP_PHASE.READY]: {
    title: 'Todo listo',
    subtitle: 'Recordá sacar fotos para la marca',
    detail:
      'Ya está todo coordinado. Sacá fotos del stand o la activación el día del evento.',
    tone: 'approved',
  },
  [HOST_SPONSORSHIP_PHASE.UPLOAD_PROOFS]: {
    title: 'Subí tus pruebas',
    subtitle: 'Mostranos que usaste los productos de la marca',
    detail:
      'Subí fotos o links de cómo usaste los productos que te envió la marca. Nosotros gestionamos el envío — con esto verificamos que los utilizaste en el evento.',
    tone: 'attention',
  },
  [HOST_SPONSORSHIP_PHASE.VERIFYING]: {
    title: 'En verificación',
    subtitle: 'Revisando el material que compartiste',
    detail:
      'Estamos revisando que hayas usado los productos de la marca en el evento. Te avisamos cuando esté validado.',
    tone: 'verification',
  },
  [HOST_SPONSORSHIP_PHASE.VALIDATED]: {
    title: 'Acuerdo validado',
    subtitle: 'Nos vemos la próxima',
    detail:
      'Patrocinio validado. Aparece en tu perfil y podés sumar la marca a tus colaboraciones.',
    tone: 'approved',
  },
}

function resolveHostPhase(status, { hostPhase, isPastEvent } = {}) {
  if (hostPhase && HOST_PHASE_PRESENTATION[hostPhase]) return hostPhase
  if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) return HOST_SPONSORSHIP_PHASE.UPLOAD_PROOFS
  if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) return HOST_SPONSORSHIP_PHASE.VERIFYING
  if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO && isPastEvent) {
    return HOST_SPONSORSHIP_PHASE.UPLOAD_PROOFS
  }
  if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO && !isPastEvent) {
    return HOST_SPONSORSHIP_PHASE.ACCEPTED
  }
  return null
}

/**
 * Copy unificada para fila colapsada y detalle expandido del host.
 * @returns {{ title: string, subtitle: string, detail: string, tone: string }}
 */
export function getInvitationPresentation(
  status,
  {
    isPastEvent = false,
    hostPhase = null,
    declineReason = null,
    invitedAt = null,
    productDeliveryBy = null,
  } = {},
) {
  const invitedLine = invitedAt ? `Enviaste la propuesta el ${formatEventDateShort(invitedAt)}.` : null

  if (status === SPONSORSHIP_STATUS.DECLINADO) {
    const trimmedReason = declineReason?.trim()
    return {
      title: 'Rechazada',
      subtitle: 'Esta marca no se suma al evento',
      detail: trimmedReason
        ? trimmedReason
        : joinPanelSentences([
            'La marca rechazó la propuesta.',
            'Podés invitar otras desde Recomendadas.',
          ]),
      tone: 'declined',
    }
  }

  if (isInvitationInReview(status)) {
    const deadline = getInvitationResponseDeadline(invitedAt)
    return {
      title: 'En revisión',
      subtitle: 'La marca está revisando tu propuesta',
      detail: joinPanelSentences([
        'La marca está evaluando tu evento. Te avisamos cuando responda.',
        deadline
          ? `Si no hay respuesta antes del ${deadline}, la solicitud se cierra sola.`
          : `Sin respuesta en ${INVITATION_RESPONSE_DAYS} días, la solicitud se cierra sola.`,
        invitedLine,
      ]),
      tone: 'review',
    }
  }

  const phase = resolveHostPhase(status, { hostPhase, isPastEvent })
  if (phase && HOST_PHASE_PRESENTATION[phase]) {
    const preset = HOST_PHASE_PRESENTATION[phase]
    let detail = preset.detail

    if (phase === HOST_SPONSORSHIP_PHASE.ACCEPTED && productDeliveryBy) {
      detail = joinPanelSentences([
        preset.detail,
        `Objetivo de entrega de productos: ${productDeliveryBy}.`,
      ])
    }

    return { ...preset, detail }
  }

  return {
    title: 'En proceso',
    subtitle: 'Seguimos tu invitación con esta marca',
    detail: joinPanelSentences(['Seguimos tu invitación con esta marca.', invitedLine]),
    tone: 'neutral',
  }
}


export function getInvitationStepPanelContent(status, options = {}) {
  const presentation = getInvitationPresentation(status, options)
  const panelTone =
    presentation.tone === 'attention'
      ? 'close'
      : presentation.tone === 'neutral'
        ? 'review'
        : presentation.tone
  return {
    tone: panelTone,
    title: presentation.title,
    body: presentation.detail,
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
  if (status === SPONSORSHIP_STATUS.DECLINADO) {
    return 'bg-secondary text-muted-foreground border-border-subtle'
  }
  return 'bg-secondary text-muted-foreground border-border-subtle'
}

const ROW_SUMMARY_TONE_CLASS = {
  approved: 'text-emerald-700',
  review: 'text-amber-700',
  declined: 'text-muted-foreground',
  attention: 'text-orange-700',
  verification: 'text-sky-700',
  neutral: 'text-foreground',
}

const ROW_BORDER_TONE_CLASS = {
  approved: 'border-emerald-200/70',
  review: 'border-border-subtle',
  declined: 'border-border-subtle bg-secondary/20',
  attention: 'border-orange-200/80',
  verification: 'border-sky-200/60',
  neutral: 'border-border-subtle',
}

/** Copy de la fila colapsada (Propuestas enviadas) */
export function getInvitationRowSummary(status, options = {}) {
  const { title, subtitle, tone } = getInvitationPresentation(status, options)
  return { title, subtitle, tone }
}

export function getInvitationRowSummaryTitleClass(tone) {
  return ROW_SUMMARY_TONE_CLASS[tone] ?? ROW_SUMMARY_TONE_CLASS.neutral
}

export function getInvitationRowBorderClass(tone) {
  return ROW_BORDER_TONE_CLASS[tone] ?? ROW_BORDER_TONE_CLASS.neutral
}
