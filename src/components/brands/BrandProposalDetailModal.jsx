import { Calendar, MapPin, MessageCircle, Package, Sparkles, StickyNote, UserCircle, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ListBlock({ title, items, icon: Icon, accentClass }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <p className={cn('flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest', accentClass)}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BrandProposalDetailModal({
  invitation,
  onClose,
  onAccept,
  onDecline,
  accepting = false,
}) {
  if (!invitation) return null

  const isPending = invitation.estado === 'pendiente'
  const isAccepted = invitation.estado === 'aceptado'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-detail-title"
    >
      <div className="animate-modal-enter flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="shrink-0 border-b border-white/10 bg-slate-900 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                Propuesta de patrocinio
              </p>
              <h2 id="proposal-detail-title" className="mt-1 font-display text-xl font-black text-white">
                {invitation.eventoTitulo}
              </h2>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(invitation.eventoFecha)}
                </span>
                {invitation.eventoUbicacion && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {invitation.eventoUbicacion}
                  </span>
                )}
                {invitation.eventoNicho && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-semibold text-slate-200">
                    {invitation.eventoNicho}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {(invitation.hostNombre || invitation.hostComunidad) && (
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <UserCircle className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Te invita</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {invitation.hostNombre ?? 'Host'}
                </p>
                {invitation.hostComunidad && (
                  <p className="text-xs text-slate-500">{invitation.hostComunidad}</p>
                )}
                {invitation.eventoAudiencia && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    {invitation.eventoAudiencia}
                  </p>
                )}
              </div>
            </div>
          )}

          <ListBlock
            title="Lo que esperan de tu marca"
            items={invitation.productosSolicitados?.length ? invitation.productosSolicitados : ['Sin detalle']}
            icon={Package}
            accentClass="text-sky-600"
          />
          <ListBlock
            title="Lo que el host ofrece a cambio"
            items={invitation.entregablesOfrecidos?.length ? invitation.entregablesOfrecidos : ['Sin detalle']}
            icon={Sparkles}
            accentClass="text-emerald-600"
          />

          {invitation.mensajeExtra && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <StickyNote className="h-3.5 w-3.5" />
                Nota del host
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{invitation.mensajeExtra}</p>
            </div>
          )}

          {invitation.fechaLimiteEntrega && (
            <p className="text-xs text-slate-500">
              Stock necesario para:{' '}
              <strong className="text-slate-700">{formatDate(invitation.fechaLimiteEntrega)}</strong>
            </p>
          )}

          {isAccepted && (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Contacto del host
              </p>
              <div className="mt-2 space-y-1 text-sm text-slate-800">
                {invitation.whatsapp && (
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    WhatsApp: <strong>{invitation.whatsapp}</strong>
                  </p>
                )}
                {invitation.direccionEntrega && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {invitation.direccionEntrega}
                  </p>
                )}
              </div>
            </div>
          )}

          {invitation.estado === 'rechazado' && invitation.mensajeRespuesta && (
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-700/80">
                Tu respuesta al host
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{invitation.mensajeRespuesta}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {isPending ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-slate-200 text-slate-600"
                disabled={accepting}
                onClick={() => onDecline?.(invitation)}
              >
                Declinar
              </Button>
              <Button
                type="button"
                className="rounded-full bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-400"
                disabled={accepting}
                onClick={() => onAccept?.(invitation)}
              >
                {accepting ? 'Aceptando…' : 'Aceptar trato'}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
