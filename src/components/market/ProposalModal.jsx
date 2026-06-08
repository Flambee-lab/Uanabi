import { useEffect, useState } from 'react'
import { Calendar, Check, CheckCircle2, MapPin, MessageCircle, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuickEventForm } from '../apply/ApplyToBrandModal'
import { EMPTY_EVENT_FORM } from '../../data/hostEvents'
import { INVITATION_SENT_COPY } from '../../utils/sponsorshipLifecycle'
import {
  buildCommercialSnapshot,
  LEAD_TIME_OPTIONS,
} from '../../utils/sponsorshipProposal'

const INPUT_CLASS =
  'w-full rounded-xl border border-border bg-secondary px-4 py-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-0'

function EventMiniCard({ event, selected, onSelect }) {
  const location = event.venueAddress ?? event.location

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
        selected
          ? 'border-primary bg-secondary'
          : 'border-border-subtle bg-white hover:border-border'
      }`}
    >
      <div
        className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-100 to-white'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-xs text-foreground">{event.title}</p>
        <p className="mt-1 flex items-center gap-1 type-small text-muted-foreground">
          <Calendar className="h-3 w-3" strokeWidth={1.75} />
          {event.date}
          {event.time ? ` · ${event.time}` : ''}
        </p>
        {location && (
          <p className="mt-0.5 flex items-center gap-1 type-small text-muted-foreground">
            <MapPin className="h-3 w-3" strokeWidth={1.75} />
            <span className="truncate">{location}</span>
          </p>
        )}
      </div>
      {selected && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
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
  hostProfile = null,
  onClose,
  onSubmit,
  onEventCreated,
}) {
  const skipEventStep = Boolean(activeEvent)
  const initialStep = skipEventStep ? 2 : 1
  const hasEvents = hostEvents.length > 0

  const [step, setStep] = useState(initialStep)
  const [eventView, setEventView] = useState(hasEvents ? 'list' : 'create')
  const [selectedEvent, setSelectedEvent] = useState(activeEvent)
  const [quickForm, setQuickForm] = useState(EMPTY_EVENT_FORM)
  const [materialRequest, setMaterialRequest] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState('7')
  const [whatsapp, setWhatsapp] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [whatsappSavedInSession, setWhatsappSavedInSession] = useState(false)

  const savedWhatsApp = hostProfile?.whatsapp?.trim() ?? ''
  const needsWhatsApp = !savedWhatsApp

  useEffect(() => {
    if (!isOpen) return
    const eventsExist = hostEvents.length > 0
    setStep(activeEvent ? 2 : 1)
    setEventView(activeEvent ? 'list' : eventsExist ? 'list' : 'create')
    setSelectedEvent(activeEvent)
    setQuickForm(EMPTY_EVENT_FORM)
    setMaterialRequest('')
    setLeadTimeDays('7')
    setWhatsapp(savedWhatsApp)
    setShowSuccess(false)
    setWhatsappSavedInSession(false)
  }, [isOpen, activeEvent, brand?.id, hostEvents.length, savedWhatsApp])

  if (!isOpen || !brand) return null

  const resolvedEvent = selectedEvent ?? activeEvent
  const canContinueStep1 = Boolean(resolvedEvent)
  const canSubmit =
    materialRequest.trim().length > 0 &&
    leadTimeDays &&
    resolvedEvent &&
    (!needsWhatsApp || whatsapp.trim().length > 0)

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setTimeout(() => setStep(2), 180)
  }

  const handleQuickEventSubmit = (event) => {
    onEventCreated?.(event)
    setSelectedEvent(event)
    setEventView('list')
    setStep(2)
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
      whatsapp: needsWhatsApp ? whatsapp.trim() : undefined,
    })
    if (needsWhatsApp && whatsapp.trim()) {
      setWhatsappSavedInSession(true)
    }
    setShowSuccess(true)
  }

  const handleClose = () => {
    setShowSuccess(false)
    onClose?.()
  }

  const step1Title = `¿Qué evento querés que patrocine ${brand.name}?`
  const step1Subtitle =
    'Le vas a solicitar a la marca que sponsoree tu evento. Se adjunta la Ficha Comercial del evento que elijas.'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div className="animate-[modal-enter_0.25s_ease-out] flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white">
        <div className="flex items-start justify-between border-b border-border-subtle px-8 py-6">
          <div>
            <p className="type-label ">
              {showSuccess ? 'Confirmación' : `Paso ${step} de 2`}
            </p>
            <h2
              id="proposal-modal-title"
              className="mt-1 font-display text-xl font-black tracking-tight text-foreground"
            >
              {showSuccess
                ? 'Propuesta enviada'
                : step === 1
                  ? step1Title
                  : `Detalles del patrocinio`}
            </h2>
            {!showSuccess && step === 1 && (
              <p className="mt-2 max-w-md type-small leading-relaxed text-muted-foreground">
                {step1Subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-8">
          {showSuccess ? (
            <div className="space-y-4">
              {whatsappSavedInSession && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                    strokeWidth={1.75}
                  />
                  <p className="text-xs leading-relaxed text-emerald-950/90">
                    <strong className="font-bold">WhatsApp guardado con éxito.</strong> Quedó en tu
                    perfil para tus próximas postulaciones y propuestas a marcas — no vas a tener que
                    cargarlo de nuevo.
                  </p>
                </div>
              )}
              <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                {INVITATION_SENT_COPY}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary/90"
              >
                Entendido
              </button>
            </div>
          ) : step === 1 ? (
            eventView === 'create' ? (
              <QuickEventForm
                form={quickForm}
                onChange={setQuickForm}
                onSubmit={handleQuickEventSubmit}
                onBack={hasEvents ? () => setEventView('list') : undefined}
                showBack={hasEvents}
              />
            ) : (
              <div className="space-y-4">
                {hostEvents.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border-subtle bg-secondary/40 px-4 py-6 text-center type-small text-muted-foreground">
                    Todavía no tenés eventos. Creá uno para solicitarle el patrocinio a{' '}
                    {brand.name}.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {hostEvents.map((event) => (
                      <EventMiniCard
                        key={event.id}
                        event={event}
                        selected={resolvedEvent?.id === event.id}
                        onSelect={handleSelectEvent}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setEventView('create')}
                  className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-secondary/50 px-5 py-4 text-left transition hover:border-foreground/30 hover:bg-selection/60"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-card">
                    <Plus className="h-4 w-4 text-foreground" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="type-body font-bold text-foreground">
                      {hasEvents ? 'Crear otro evento' : 'Crear mi evento'}
                    </p>
                    <p className="type-small mt-0.5 text-muted-foreground">
                      Formulario rápido · después seguís con la propuesta
                    </p>
                  </div>
                </button>
              </div>
            )
          ) : (
            <form id="proposal-form" onSubmit={handleSubmit} className="space-y-6">
              {resolvedEvent && (
                <div className="rounded-2xl border border-border-subtle bg-secondary p-4">
                  <p className="type-label ">Evento a patrocinar</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{resolvedEvent.title}</p>
                  <p className="mt-0.5 type-small text-muted-foreground">
                    La Ficha Comercial de este evento se adjunta automáticamente a tu
                    propuesta para {brand.name}.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="material-request" className="block text-xs font-bold text-foreground">
                  ¿Qué productos o recursos necesitás de {brand.name}?
                </label>
                <textarea
                  id="material-request"
                  className={`${INPUT_CLASS} min-h-[100px] resize-y`}
                  value={materialRequest}
                  onChange={(e) => setMaterialRequest(e.target.value)}
                  placeholder='Ej: "400 unidades para sampling en acreditaciones"'
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-time" className="block text-xs font-bold text-foreground">
                  ¿Con cuántos días de anticipación necesitás el producto en el venue?
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

              {needsWhatsApp ? (
                <div className="space-y-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
                  <div className="flex gap-3">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" strokeWidth={1.75} />
                    <p className="text-xs leading-relaxed text-emerald-950/85">
                      <strong className="font-bold">Falta tu WhatsApp comercial.</strong> Es el canal
                      que {brand.name} va a usar para contactarte, coordinar el patrocinio y cerrar
                      detalles del evento.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="proposal-whatsapp" className="block text-xs font-bold text-foreground">
                      WhatsApp comercial *
                    </label>
                    <div className="relative">
                      <MessageCircle
                        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={1.75}
                      />
                      <input
                        id="proposal-whatsapp"
                        type="tel"
                        className={`${INPUT_CLASS} pl-11`}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="11 2345 6789"
                        autoComplete="tel"
                      />
                    </div>
                    <p className="type-small text-muted-foreground">
                      Con código de área. Lo guardamos en tu perfil para futuras propuestas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 rounded-2xl border border-border-subtle bg-secondary/50 px-4 py-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {brand.name} te va a contactar por WhatsApp al{' '}
                    <span className="font-bold text-foreground">{savedWhatsApp}</span> para coordinar
                    el patrocinio.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {!showSuccess && step === 1 && eventView === 'list' && (
          <div className="flex justify-end border-t border-border-subtle px-8 py-6">
            <button
              type="button"
              disabled={!canContinueStep1}
              onClick={() => setStep(2)}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-40 hover:bg-primary/90"
            >
              Continuar con este evento
            </button>
          </div>
        )}

        {!showSuccess && step === 2 && (
          <div className="flex items-center justify-between border-t border-border-subtle px-8 py-6">
            {!skipEventStep ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground/80"
              >
                Volver
              </button>
            ) : (
              <span />
            )}
            <Button
              type="submit"
              form="proposal-form"
              size="event"
              disabled={!canSubmit}
              className="px-8"
            >
              Enviar propuesta de patrocinio
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
