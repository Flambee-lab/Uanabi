import { useMemo, useState } from 'react'
import {
  Calendar,
  Globe,
  ImagePlus,
  MapPin,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  buildEventFromForm,
  COVER_GRADIENTS,
  EVENT_FORMATS,
  EVENT_NICHES,
  getDefaultCreateEventForm,
  validateCreateEventForm,
} from '../utils/eventForm'

function FieldLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block type-label "
    >
      {children}
    </label>
  )
}

function FieldInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary ${className}`}
      {...props}
    />
  )
}

function FieldTextarea({ className = '', ...props }) {
  return (
    <textarea
      rows={4}
      className={`w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary ${className}`}
      {...props}
    />
  )
}

export default function CreateEventView({ onClose, onSubmit }) {
  const [form, setForm] = useState(getDefaultCreateEventForm)
  const [errors, setErrors] = useState({})

  const selectedGradient = useMemo(
    () => COVER_GRADIENTS.find((g) => g.id === form.coverGradientId) ?? COVER_GRADIENTS[4],
    [form.coverGradientId],
  )

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const showVenue = form.format === 'presencial' || form.format === 'hibrido'
  const showVirtual = form.format === 'online' || form.format === 'hibrido'

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateCreateEventForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const id = `evt-${Date.now()}`
    onSubmit?.(buildEventFromForm(form, id))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fafafa]">
      <header className="flex shrink-0 items-center justify-between border-b border-border-subtle bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <h1 className="font-display text-sm font-bold text-foreground sm:text-base">
          Crear evento
        </h1>
        <div className="w-9" aria-hidden />
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-5 lg:gap-10 lg:py-10">
          {/* Portada */}
          <div className="lg:col-span-2">
            <div
              className={`relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br shadow-sm ${selectedGradient.class}`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                {form.title ? (
                  <p className="font-display text-lg font-black uppercase tracking-widest text-foreground/80">
                    {form.title.slice(0, 28)}
                  </p>
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-foreground/30" strokeWidth={1.5} />
                    <p className="mt-3 text-xs font-medium text-foreground/50">Portada del evento</p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 max-w-sm">
              <FieldLabel>Estilo de portada</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {COVER_GRADIENTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => update({ coverGradientId: g.id })}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      form.coverGradientId === g.id
                        ? 'border-primary bg-white text-foreground shadow-sm'
                        : 'border-border bg-white text-muted-foreground hover:border-border'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-gradient-to-br ${g.class}`}
                      aria-hidden
                    />
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-6 lg:col-span-3">
            <div>
              <FieldLabel htmlFor="event-title">Nombre del evento</FieldLabel>
              <FieldInput
                id="event-title"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Ej: Neon LAN Party — Torneo Valorant"
                autoFocus
              />
              {errors.title && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <FieldLabel>Formato</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {EVENT_FORMATS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ format: opt.id })}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                      form.format === opt.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-white text-muted-foreground hover:border-border'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                <span className="text-sm font-bold">Fecha y horario</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="start-date">Inicio — fecha</FieldLabel>
                  <FieldInput
                    id="start-date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update({ startDate: e.target.value })}
                  />
                  {errors.startDate && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <FieldLabel htmlFor="start-time">Inicio — hora</FieldLabel>
                  <FieldInput
                    id="start-time"
                    type="time"
                    value={form.startTime}
                    onChange={(e) => update({ startTime: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="end-date">Fin — fecha</FieldLabel>
                  <FieldInput
                    id="end-date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update({ endDate: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="end-time">Fin — hora</FieldLabel>
                  <FieldInput
                    id="end-time"
                    type="time"
                    value={form.endTime}
                    onChange={(e) => update({ endTime: e.target.value })}
                  />
                </div>
              </div>
              <p className="mt-3 type-small text-muted-foreground">Zona horaria: GMT-3 · Buenos Aires</p>
            </div>

            {showVenue && (
              <div className="rounded-2xl border border-border-subtle bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" strokeWidth={1.75} />
                  <span className="text-sm font-bold text-foreground">Ubicación presencial</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <FieldLabel htmlFor="venue-name">Lugar</FieldLabel>
                    <FieldInput
                      id="venue-name"
                      value={form.venueName}
                      onChange={(e) => update({ venueName: e.target.value })}
                      placeholder="Ej: Centro Cultural Konex"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="venue-address">Dirección</FieldLabel>
                    <FieldInput
                      id="venue-address"
                      value={form.venueAddress}
                      onChange={(e) => update({ venueAddress: e.target.value })}
                      placeholder="Ej: Sarmiento 3131 · Palermo, Buenos Aires"
                    />
                  </div>
                </div>
                {errors.venue && (
                  <p className="mt-2 text-xs font-medium text-red-600">{errors.venue}</p>
                )}
              </div>
            )}

            {showVirtual && (
              <div className="rounded-2xl border border-border-subtle bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  <span className="text-sm font-bold text-foreground">Enlace virtual</span>
                </div>
                <FieldInput
                  value={form.virtualLink}
                  onChange={(e) => update({ virtualLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
                {errors.virtualLink && (
                  <p className="mt-2 text-xs font-medium text-red-600">{errors.virtualLink}</p>
                )}
              </div>
            )}

            <div>
              <FieldLabel htmlFor="description">Acerca del evento</FieldLabel>
              <FieldTextarea
                id="description"
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Describí la experiencia, tu audiencia y qué tipo de sponsors buscás..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="niche">Nicho</FieldLabel>
                <select
                  id="niche"
                  value={form.niche}
                  onChange={(e) => update({ niche: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
                >
                  {EVENT_NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="capacity">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    Personas estimadas
                  </span>
                </FieldLabel>
                <FieldInput
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => update({ capacity: e.target.value })}
                  placeholder="Ej: 120"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-border-subtle bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-5xl justify-end gap-3">
            <Button type="button" variant="tertiary" size="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg">
              Crear evento
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
