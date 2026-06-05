import { useEffect, useState } from 'react'
import { ChevronDown, Plus, Sparkles, X } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import { INPUT_CLASS, LABEL_CLASS } from '@/components/ui/form-field'
import { EMPTY_EVENT_FORM, createEventFromForm } from '../../data/hostEvents'

function FormSection({ step, title, description, children }) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-background p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white">
          {step}
        </span>
        <div>
          <h3 className="font-display text-sm font-extrabold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function QuickEventForm({ form, onChange, onSubmit, onBack, showBack }) {
  const isValid =
    form.title.trim() &&
    form.socialLink.trim() &&
    (form.isVirtual || form.location.trim()) &&
    form.audience.trim() &&
    form.offers.trim() &&
    form.seeks.trim()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (isValid) onSubmit(createEventFromForm(form))
      }}
      className="space-y-5"
    >
      <FormSection
        step="1"
        title="Identidad"
        description="Lo mínimo para que la marca valide que sos real."
      >
        <div>
          <label htmlFor="event-title" className={LABEL_CLASS}>
            Título del evento
          </label>
          <input
            id="event-title"
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="Ej: Neon LAN Party — Torneo Valorant"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="event-social" className={LABEL_CLASS}>
            Red social o enlace principal
          </label>
          <input
            id="event-social"
            type="url"
            value={form.socialLink}
            onChange={(e) => onChange({ ...form, socialLink: e.target.value })}
            placeholder="https://instagram.com/tuevento"
            className={INPUT_CLASS}
          />
        </div>
      </FormSection>

      <FormSection
        step="2"
        title="Métricas del espacio"
        description="Ubicación y alcance estimado para evaluar fit con la marca."
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...form, isVirtual: !form.isVirtual })}
            className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
              form.isVirtual
                ? 'border-[#111827] bg-primary text-white'
                : 'border-border-subtle bg-white text-muted-foreground hover:border-[#d1d5db]'
            }`}
          >
            Virtual
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...form, isVirtual: false })}
            className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
              !form.isVirtual
                ? 'border-[#111827] bg-primary text-white'
                : 'border-border-subtle bg-white text-muted-foreground hover:border-[#d1d5db]'
            }`}
          >
            Presencial
          </button>
        </div>
        {!form.isVirtual && (
          <div>
            <label htmlFor="event-location" className={LABEL_CLASS}>
              Ubicación física
            </label>
            <input
              id="event-location"
              type="text"
              value={form.location}
              onChange={(e) => onChange({ ...form, location: e.target.value })}
              placeholder="Ej: Palermo, Buenos Aires"
              className={INPUT_CLASS}
            />
          </div>
        )}
        <div>
          <label htmlFor="event-audience" className={LABEL_CLASS}>
            Audiencia estimada
          </label>
          <input
            id="event-audience"
            type="text"
            value={form.audience}
            onChange={(e) => onChange({ ...form, audience: e.target.value })}
            placeholder="Ej: 300 presenciales / 5k reach"
            className={INPUT_CLASS}
          />
        </div>
      </FormSection>

      <FormSection
        step="3"
        title="El trato profesional"
        description="Qué visibilidad ofrecés y qué esperás de la marca."
      >
        <div>
          <label htmlFor="event-offers" className={LABEL_CLASS}>
            Qué ofrece tu evento
          </label>
          <textarea
            id="event-offers"
            rows={3}
            value={form.offers}
            onChange={(e) => onChange({ ...form, offers: e.target.value })}
            placeholder="Menciones en stream, stand de activación, banners..."
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>
        <div>
          <label htmlFor="event-seeks" className={LABEL_CLASS}>
            Qué buscás de la marca
          </label>
          <textarea
            id="event-seeks"
            rows={3}
            value={form.seeks}
            onChange={(e) => onChange({ ...form, seeks: e.target.value })}
            placeholder="Canje de producto, $80k en efectivo..."
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Volver al selector
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar y Postular
        </button>
      </div>
    </form>
  )
}

export default function ApplyToBrandModal({
  isOpen,
  brand,
  hostEvents,
  onClose,
  onSubmit,
}) {
  const [view, setView] = useState('select')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [form, setForm] = useState(EMPTY_EVENT_FORM)

  const hasEvents = hostEvents.length > 0

  useEffect(() => {
    if (!isOpen) return undefined

    const initialView = hasEvents ? 'select' : 'create'
    setView(initialView)
    setSelectedEventId(hostEvents[0]?.id ?? '')
    setForm(EMPTY_EVENT_FORM)

    document.body.style.overflow = 'hidden'
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, hasEvents, hostEvents, onClose])

  if (!isOpen || !brand) return null

  const selectedEvent = hostEvents.find((e) => e.id === selectedEventId)

  const handleExistingSubmit = () => {
    if (!selectedEvent) return
    onSubmit({ event: selectedEvent, isNew: false })
  }

  const handleNewSubmit = (event) => {
    onSubmit({ event, isNew: true })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="animate-backdrop-enter absolute inset-0 bg-primary/25 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="animate-modal-enter relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border-subtle bg-white shadow-2xl shadow-black/10 sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-border-subtle px-7 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo
                name={brand.name}
                logo={brand.logo}
                logoFallback={brand.logoFallback}
                size="md"
              />
              <div>
                <p className="type-label ">
                  Postulación directa
                </p>
                <h2
                  id="apply-modal-title"
                  className="font-display text-lg font-extrabold tracking-tight text-foreground"
                >
                  {brand.name}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div
            key={view}
            className="animate-modal-enter space-y-6"
          >
            {view === 'select' && (
              <>
                <div>
                  <label htmlFor="event-select" className={LABEL_CLASS}>
                    ¿Con qué evento querés postularte?
                  </label>
                  <div className="relative">
                    <select
                      id="event-select"
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className={`${INPUT_CLASS} appearance-none pr-10`}
                    >
                      {hostEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                  </div>
                </div>

                {selectedEvent && (
                  <div className="rounded-2xl border border-border-subtle bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">{selectedEvent.audience}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedEvent.isVirtual ? 'Virtual' : selectedEvent.location}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setView('create')}
                  className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#d1d5db] bg-[#fafafa] px-5 py-4 text-left transition-all hover:border-[#111827] hover:bg-match/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border-subtle">
                    <Plus className="h-4 w-4 text-foreground" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Crear un evento nuevo desde cero</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Formulario rápido en 3 pasos</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExistingSubmit}
                  disabled={!selectedEventId}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                  Postular con este evento
                </button>
              </>
            )}

            {view === 'create' && (
              <QuickEventForm
                form={form}
                onChange={setForm}
                onSubmit={handleNewSubmit}
                onBack={hasEvents ? () => setView('select') : undefined}
                showBack={hasEvents}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
