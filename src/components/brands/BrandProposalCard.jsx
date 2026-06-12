import { Calendar, ChevronRight, Clock, MapPin, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDateShort(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

function daysUntil(iso) {
  if (!iso) return null
  const target = new Date(`${iso}T12:00:00`)
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

const ESTADO_BADGE = {
  pendiente: 'border-amber-200 bg-amber-50 text-amber-800',
  aceptado: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rechazado: 'border-orange-200 bg-orange-50 text-orange-800',
  declinado: 'border-orange-200 bg-orange-50 text-orange-800',
  contraoferta: 'border-sky-200 bg-sky-50 text-sky-800',
}

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  aceptado: 'Aceptada',
  rechazado: 'Declinada',
  declinado: 'Declinada',
  contraoferta: 'Contraoferta enviada',
}

export default function BrandProposalCard({ invitation, onOpen }) {
  const isPending = invitation.estado === 'pendiente'
  const deadlineDays = isPending ? daysUntil(invitation.fechaLimiteEntrega) : null
  const deadlineUrgent = deadlineDays != null && deadlineDays <= 7

  return (
    <button
      type="button"
      onClick={() => onOpen?.(invitation)}
      className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300/70 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-sm font-black text-slate-900">
            {invitation.eventoTitulo}
          </h3>
          {invitation.eventoNicho && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {invitation.eventoNicho}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateShort(invitation.eventoFecha)}
          </span>
          {invitation.eventoUbicacion && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {invitation.eventoUbicacion}
            </span>
          )}
          {invitation.hostNombre && (
            <span className="inline-flex items-center gap-1">
              <UserCircle className="h-3.5 w-3.5" />
              {invitation.hostNombre}
            </span>
          )}
          {isPending && invitation.fechaLimiteEntrega && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                deadlineUrgent ? 'text-amber-700' : 'text-slate-500',
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              Stock para el {formatDateShort(invitation.fechaLimiteEntrega)}
              {deadlineUrgent && deadlineDays >= 0 && ' · vence pronto'}
            </span>
          )}
        </div>
      </div>

      <span
        className={cn(
          'shrink-0 rounded-full border px-3 py-1 text-xs font-semibold',
          ESTADO_BADGE[invitation.estado] ?? ESTADO_BADGE.pendiente,
        )}
      >
        {ESTADO_LABEL[invitation.estado] ?? 'En proceso'}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-emerald-500" />
    </button>
  )
}
