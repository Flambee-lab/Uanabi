import { supabase, isSupabaseConfigured } from './supabase'
import { SPONSORSHIP_STATUS } from '../utils/sponsorshipLifecycle'
import {
  loadLocalBrandInvitaciones,
  mapInvitacionRow,
  saveLocalBrandInvitaciones,
} from '../data/mockBrandInvitaciones'

export const DEFAULT_BRAND_DECLINE_MESSAGE =
  '¡Hola! Muchas gracias por la propuesta para tu evento. En este momento tenemos la agenda de patrocinios completa para estas fechas y no podemos asistir, pero nos encantaría que nos tengas en cuenta para tus próximos proyectos. ¡Gracias por hacernos parte de la comunidad UANABI!'

const REJECTED_ESTADOS = new Set(['rechazado', 'declinado'])

export function isRejectedInvitacionEstado(estado) {
  return REJECTED_ESTADOS.has(estado)
}

export function normalizeInvitacionEstado(estado) {
  if (estado === 'rechazado') return SPONSORSHIP_STATUS.DECLINADO
  return estado
}

/** Mensaje de la marca: DB `mensaje_respuesta` o copy amigable por defecto si está rechazada. */
export function resolveMensajeRespuesta(row = {}) {
  const custom = (row.mensaje_respuesta ?? row.mensajeRespuesta ?? '').trim()
  if (custom) return custom
  if (isRejectedInvitacionEstado(row.estado)) return DEFAULT_BRAND_DECLINE_MESSAGE
  return ''
}

export function getBrandDeclineMessage(brand) {
  const custom = brand?.mensajeRespuesta?.trim()
  if (custom) return custom
  const status = brand?.invitationStatus
  if (status === SPONSORSHIP_STATUS.DECLINADO || status === 'rechazado') {
    return DEFAULT_BRAND_DECLINE_MESSAGE
  }
  return ''
}

export async function saveInvitacionMarca({
  eventoId,
  marcaNombre,
  productosSolicitados = [],
  entregablesOfrecidos = [],
  fechaLimiteEntrega,
  mensajeExtra = '',
  cantidadEstimada = '',
  direccionEntrega = '',
  horarioRecepcion = '',
  contactoEnSitio = '',
  whatsapp = '',
}) {
  const row = {
    evento_id: eventoId,
    marca_nombre: marcaNombre,
    productos_solicitados: productosSolicitados,
    entregables_ofrecidos: entregablesOfrecidos,
    fecha_limite_entrega: fechaLimiteEntrega || null,
    mensaje_extra: mensajeExtra?.trim() || null,
    cantidad_estimada: cantidadEstimada || null,
    direccion_entrega: direccionEntrega?.trim() || null,
    horario_recepcion: horarioRecepcion || null,
    contacto_en_sitio: contactoEnSitio?.trim() || null,
    whatsapp: whatsapp?.trim() || null,
    estado: 'pendiente',
  }

  if (!isSupabaseConfigured || !supabase) {
    return { data: { id: `local-${Date.now()}`, ...row }, error: null, persisted: false }
  }

  const { data, error } = await supabase
    .from('invitaciones_marcas')
    .insert(row)
    .select()
    .single()

  if (error) {
    return { data: null, error, persisted: false }
  }

  return { data, error: null, persisted: true }
}

export async function fetchInvitacionesMarcasForEvents(eventoIds = []) {
  const ids = [...new Set(eventoIds.filter(Boolean))]
  if (!ids.length || !isSupabaseConfigured || !supabase) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('invitaciones_marcas')
    .select('id, evento_id, marca_nombre, estado, mensaje_respuesta, created_at')
    .in('evento_id', ids)

  return { data: data ?? [], error }
}

function loadLocalInvitacionesForMarca(normalized, eventsById) {
  const rows = loadLocalBrandInvitaciones()
  const matching = rows.filter((row) => row.marca_nombre?.toLowerCase() === normalized)
  // Demo: si la marca registrada no coincide con los mocks, mostramos todos igual
  const source = matching.length > 0 ? matching : rows
  return source.map((row) => mapInvitacionRow(row, eventsById))
}

export async function fetchInvitacionesForMarca(marcaNombre, eventsById = {}) {
  const normalized = (marcaNombre ?? '').trim().toLowerCase()
  if (!normalized) return { data: [], error: null }

  if (!isSupabaseConfigured || !supabase) {
    return {
      data: loadLocalInvitacionesForMarca(normalized, eventsById),
      error: null,
      persisted: false,
    }
  }

  const { data, error } = await supabase
    .from('invitaciones_marcas')
    .select('*')
    .ilike('marca_nombre', marcaNombre.trim())
    .order('created_at', { ascending: false })

  // Demo: sin filas reales en Supabase, caemos a las invitaciones mock locales
  if (error || !data?.length) {
    return {
      data: loadLocalInvitacionesForMarca(normalized, eventsById),
      error: null,
      persisted: false,
    }
  }

  const mapped = data.map((row) => mapInvitacionRow(row, eventsById))
  return { data: mapped, error: null, persisted: true }
}

export async function updateInvitacionEstado(id, { estado, mensajeRespuesta = null } = {}) {
  const patch = {
    estado,
    ...(mensajeRespuesta != null ? { mensaje_respuesta: mensajeRespuesta } : {}),
  }

  const isLocalRow = typeof id === 'string' && (id.startsWith('inv-mock') || id.startsWith('local-'))

  if (!isSupabaseConfigured || !supabase || isLocalRow) {
    const rows = loadLocalBrandInvitaciones()
    const next = rows.map((row) =>
      row.id === id ? { ...row, estado, mensaje_respuesta: mensajeRespuesta } : row,
    )
    saveLocalBrandInvitaciones(next)
    const updated = next.find((r) => r.id === id)
    return { data: updated ? mapInvitacionRow(updated) : null, error: null, persisted: false }
  }

  const { data, error } = await supabase
    .from('invitaciones_marcas')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  return {
    data: data ? mapInvitacionRow(data) : null,
    error,
    persisted: true,
  }
}

/** Enriquece invitedBrands con estado y mensaje_respuesta desde Supabase. */
export function mergeInvitacionesMarcasIntoEvents(events, invitaciones = [], catalog = []) {
  if (!invitaciones.length) return events

  const rowsByKey = new Map()
  for (const row of invitaciones) {
    const key = `${row.evento_id}::${(row.marca_nombre ?? '').toLowerCase()}`
    const existing = rowsByKey.get(key)
    if (!existing || new Date(row.created_at) > new Date(existing.created_at)) {
      rowsByKey.set(key, row)
    }
  }

  return events.map((event) => {
    const invitedBrands = (event.invitedBrands ?? []).map((invite) => {
      const brand = catalog.find((b) => b.id === invite.brandId)
      const key = `${event.id}::${(brand?.name ?? '').toLowerCase()}`
      const row = rowsByKey.get(key)
      if (!row) return invite

      const normalizedStatus = normalizeInvitacionEstado(row.estado)
      const nextStatus =
        normalizedStatus === SPONSORSHIP_STATUS.DECLINADO ||
        invite.status === SPONSORSHIP_STATUS.DECLINADO
          ? SPONSORSHIP_STATUS.DECLINADO
          : invite.status

      return {
        ...invite,
        status: nextStatus,
        invitacionId: row.id,
        mensajeRespuesta: resolveMensajeRespuesta(row),
      }
    })

    return { ...event, invitedBrands }
  })
}
