/** Estados del ciclo de vida de un patrocinio por evento × marca */
export const SPONSORSHIP_STATUS = {
  INVITACION_ENVIADA: 'invitacion_enviada',
  MATCH_ACEPTADO: 'match_aceptado',
  DECLINADO: 'declinado',
  CASO_ABIERTO: 'caso_abierto',
  EN_VERIFICACION: 'en_verificacion_admin',
}

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

export function getInvitationBadgeClass(status) {
  if (status === SPONSORSHIP_STATUS.INVITACION_ENVIADA) {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }
  if (status === SPONSORSHIP_STATUS.EN_VERIFICACION) {
    return 'bg-sky-50 text-sky-700 border-sky-100'
  }
  if (status === SPONSORSHIP_STATUS.CASO_ABIERTO) {
    return 'bg-orange-50 text-orange-700 border-orange-100'
  }
  if (status === SPONSORSHIP_STATUS.MATCH_ACEPTADO) {
    return 'bg-[#f4f6e9] text-[#1d230d] border-[#e8ecd8]'
  }
  if (status === SPONSORSHIP_STATUS.DECLINADO) {
    return 'bg-neutral-50 text-neutral-500 border-neutral-100'
  }
  return 'bg-neutral-50 text-neutral-600 border-neutral-100'
}
