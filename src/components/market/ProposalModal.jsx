import { useEffect, useState } from 'react'
import { Calendar, Check, MapPin, X } from 'lucide-react'
import { INVITATION_SENT_COPY } from '../../utils/sponsorshipLifecycle'
import {
  buildCommercialSnapshot,
  LEAD_TIME_OPTIONS,
} from '../../utils/sponsorshipProposal'

const INPUT_CLASS =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-0'

function EventMiniCard({ event, selected, onSelect }) {
  const location = event.venueAddress ?? event.location

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
        selected
          ? 'border-neutral-900 bg-neutral-50'
          : 'border-neutral-100 bg-white hover:border-neutral-300'
      }`}
    >
      <div
        className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-100 to-white'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-xs text-neutral-900">{event.title}</p>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500">
          <Calendar className="h-3 w-3" strokeWidth={1.75} />
          {event.date}
          {event.time ? ` · ${event.time}` : ''}
        </p>
        {location && (
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-400">
            <MapPin className="h-3 w-3" strokeWidth={1.75} />
            <span className="truncate">{location}</span>
          </p>
        )}
      </div>
      {selected && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      )}
    </button>
  )
}

export default function ProposalModal({
  isOpen,
  brand,
  hostEvents = [],
  activeEvent = null,
  onClose,
  onSubmit,
}) {
  const skipEventStep = Boolean(activeEvent)
  const initialStep = skipEventStep ? 2 : 1

  const [step, setStep] = useState(initialStep)
  const [selectedEvent, setSelectedEvent] = useState(activeEvent)
  const [materialRequest, setMaterialRequest] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState('7')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setStep(activeEvent ? 2 : 1)
    setSelectedEvent(activeEvent)
    setMaterialRequest('')
    setLeadTimeDays('7')
    setShowSuccess(false)
  }, [isOpen, activeEvent, brand?.id])

  if (!isOpen || !brand) return null

  const resolvedEvent = selectedEvent ?? activeEvent
  const canContinueStep1 = Boolean(resolvedEvent)
  const canSubmit =
    materialRequest.trim().length > 0 && leadTimeDays && resolvedEvent

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setTimeout(() => setStep(2), 180)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({
      event: resolvedEvent,
      proposal: {
        materialRequest: materialRequest.trim(),
        leadTimeDays,
        commercialSnapshot: buildCommercialSnapshot(resolvedEvent),
      },
    })
    setShowSuccess(true)
  }

  const handleClose = () => {
    setShowSuccess(false)
    onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div className="animate-[modal-enter_0.25s_ease-out] flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-start justify-between border-b border-neutral-100 px-8 py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {showSuccess ? 'Confirmación' : `Paso ${step} de 2`}
            </p>
            <h2
              id="proposal-modal-title"
              className="mt-1 font-display text-xl font-black tracking-tight text-neutral-900"
            >
              {showSuccess
                ? 'Propuesta enviada'
                : step === 1
                  ? 'Selecciona el evento para esta marca'
                  : `Detalles de la propuesta para ${brand.name}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-8">
          {showSuccess ? (
            <div className="space-y-6">
              <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                {INVITATION_SENT_COPY}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-neutral-900 py-3.5 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Entendido
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-3">
              {hostEvents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-sm text-neutral-400">
                  Creá un evento antes de enviar una propuesta
                </p>
              ) : (
                hostEvents.map((event) => (
                  <EventMiniCard
                    key={event.id}
                    event={event}
                    selected={resolvedEvent?.id === event.id}
                    onSelect={handleSelectEvent}
                  />
                ))
              )}
            </div>
          ) : (
            <form id="proposal-form" onSubmit={handleSubmit} className="space-y-6">
              {resolvedEvent && (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Evento seleccionado
                  </p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">{resolvedEvent.title}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    La Ficha Comercial de este evento se adjunta automáticamente a tu propuesta.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="material-request" className="block text-xs font-bold text-neutral-800">
                  ¿Qué productos o recursos específicos necesitás de esta marca para tu evento?
                </label>
                <textarea
                  id="material-request"
                  className={`${INPUT_CLASS} min-h-[100px] resize-y`}
                  value={materialRequest}
                  onChange={(e) => setMaterialRequest(e.target.value)}
                  placeholder='Ej: "400 latas de producto para la zona de acreditaciones"'
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-time" className="block text-xs font-bold text-neutral-800">
                  ¿Con cuántos días de anticipación necesitás que llegue el producto al lugar?
                </label>
                <select
                  id="lead-time"
                  className={INPUT_CLASS}
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                >
                  {LEAD_TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          )}
        </div>

        {!showSuccess && step === 1 && (
          <div className="flex justify-end border-t border-neutral-100 px-8 py-6">
            <button
              type="button"
              disabled={!canContinueStep1}
              onClick={() => setStep(2)}
              className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white disabled:opacity-40 hover:bg-neutral-800"
            >
              Continuar
            </button>
          </div>
        )}

        {!showSuccess && step === 2 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-8 py-6">
            {!skipEventStep ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-neutral-400 hover:text-neutral-700"
              >
                Volver
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              form="proposal-form"
              disabled={!canSubmit}
              className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white disabled:opacity-40 hover:bg-neutral-800"
            >
              Enviar propuesta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
