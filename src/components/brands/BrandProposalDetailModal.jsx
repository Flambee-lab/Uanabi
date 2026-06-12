import { useState } from 'react'
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
  StickyNote,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BRAND_INPUT_CLASS } from './BrandPanelShell'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Link wa.me con mensaje precargado para coordinar el trato aceptado */
function buildWhatsAppLink(invitation, marcaNombre) {
  const digits = (invitation.whatsapp ?? '').replace(/\D/g, '')
  if (!digits) return null
  const full = digits.startsWith('54') ? digits : `549${digits}`
  const text = encodeURIComponent(
    `¡Hola${invitation.hostNombre ? ` ${invitation.hostNombre}` : ''}! Somos ${marcaNombre} 👋 Aceptamos tu propuesta para "${invitation.eventoTitulo}". Te escribimos para coordinar la entrega y los detalles de logística.`,
  )
  return `https://wa.me/${full}?text=${text}`
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
  marcaNombre = 'Tu marca',
  onClose,
  onAccept,
  onDecline,
  onCounterOffer,
  accepting = false,
  countering = false,
}) {
  const [counterMode, setCounterMode] = useState(false)
  const [counterMessage, setCounterMessage] = useState('')

  if (!invitation) return null

  const isPending = invitation.estado === 'pendiente'
  const isAccepted = invitation.estado === 'aceptado'
  const isCounterOffered = invitation.estado === 'contraoferta'
  const whatsAppLink = buildWhatsAppLink(invitation, marcaNombre)

  const handleSendCounter = () => {
    if (!counterMessage.trim()) return
    onCounterOffer?.(invitation, counterMessage.trim())
    setCounterMode(false)
    setCounterMessage('')
  }

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
          {isAccepted && (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                Trato aceptado — coordiná la entrega por WhatsApp
              </p>
              <div className="mt-2.5 space-y-1 text-sm text-slate-800">
                {invitation.whatsapp && (
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    WhatsApp del host: <strong>{invitation.whatsapp}</strong>
                  </p>
                )}
                {invitation.direccionEntrega && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Entrega: {invitation.direccionEntrega}
                  </p>
                )}
                {invitation.fechaLimiteEntrega && (
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Stock para el {formatDate(invitation.fechaLimiteEntrega)}
                  </p>
                )}
              </div>
              {whatsAppLink && (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Abrir WhatsApp con mensaje listo
                </a>
              )}
            </div>
          )}

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

          {!isAccepted && invitation.fechaLimiteEntrega && (
            <p className="text-xs text-slate-500">
              Stock necesario para:{' '}
              <strong className="text-slate-700">{formatDate(invitation.fechaLimiteEntrega)}</strong>
            </p>
          )}

          {isCounterOffered && invitation.mensajeRespuesta && (
            <div className="rounded-xl border border-sky-200/80 bg-sky-50/60 p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-700">
                <ArrowLeftRight className="h-3.5 w-3.5" />
                Tu contraoferta
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{invitation.mensajeRespuesta}</p>
              <p className="mt-2 text-xs text-slate-500">
                El host la va a ver en su panel y puede contactarte para renegociar.
              </p>
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
          {isPending && counterMode ? (
            <div className="space-y-3">
              <div>
                <label htmlFor="counter-message" className="mb-1.5 block text-xs font-bold text-slate-800">
                  ¿Qué cambiarías de la propuesta?
                </label>
                <textarea
                  id="counter-message"
                  className={`${BRAND_INPUT_CLASS} min-h-[88px] resize-y`}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  placeholder="Ej: Podemos enviar 40 unidades en vez de 80, y sumamos 2 coolers. ¿Les sirve si a cambio agregan un posteo en feed?"
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-200 text-slate-600"
                  disabled={countering}
                  onClick={() => setCounterMode(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-sky-500 px-6 font-bold text-white hover:bg-sky-400"
                  disabled={countering || !counterMessage.trim()}
                  onClick={handleSendCounter}
                >
                  {countering ? 'Enviando…' : 'Enviar contraoferta'}
                </Button>
              </div>
            </div>
          ) : isPending ? (
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
                variant="outline"
                className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
                disabled={accepting}
                onClick={() => setCounterMode(true)}
              >
                <ArrowLeftRight className="h-4 w-4" />
                Contraoferta
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
