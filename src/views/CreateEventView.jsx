import { useMemo, useRef, useState } from 'react'
import {
  Calendar,
  Globe,
  ImagePlus,
  MapPin,
  Users,
  X,
} from 'lucide-react'
import {
  AUDIENCE_GENDER_OPTIONS,
  buildEventFromForm,
  COVER_GRADIENTS,
  EVENT_FORMATS,
  EVENT_NICHES,
  getDefaultCreateEventForm,
  validateCreateEventForm,
} from '../utils/eventForm'

function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block type-label">
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

function CoverUpload({ previewUrl, gradientClass, title, onPick, onClear }) {
  const inputRef = useRef(null)

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative aspect-square w-full overflow-hidden rounded-3xl shadow-sm"
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-semibold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              Cambiar foto
            </span>
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              {title ? (
                <p className="font-display text-lg font-black uppercase tracking-widest text-foreground/80">
                  {title.slice(0, 28)}
                </p>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-foreground/30" strokeWidth={1.5} />
                  <p className="mt-3 text-xs font-medium text-foreground/50">Portada del evento</p>
                </>
              )}
            </div>
            <span className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 py-2 text-xs font-semibold text-foreground shadow-sm">
              Subir portada
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
      {previewUrl && (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Quitar portada
        </button>
      )}
    </div>
  )
}

function PhotoSlot({ label, previewUrl, onPick, onClear }) {
  const inputRef = useRef(null)

  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-border bg-white transition hover:border-primary/40"
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[10px] font-semibold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              Cambiar
            </span>
          </>
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
            <ImagePlus className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
      {previewUrl && (
        <button
          type="button"
          onClick={onClear}
          className="mt-1 text-[9px] font-semibold text-muted-foreground hover:text-foreground"
        >
          Quitar
        </button>
      )}
    </div>
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

  const setCoverImage = (file) => {
    update({
      coverImage: { name: file.name, previewUrl: URL.createObjectURL(file) },
    })
  }

  const setSecondaryPhoto = (index, file) => {
    const next = [...form.secondaryPhotos]
    next[index] = { name: file.name, previewUrl: URL.createObjectURL(file) }
    update({ secondaryPhotos: next })
  }

  const clearSecondaryPhoto = (index) => {
    const next = [...form.secondaryPhotos]
    next[index] = null
    update({ secondaryPhotos: next })
  }

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
        <span className="font-display text-sm font-bold text-foreground sm:text-base">
          Nuevo evento
        </span>
        <div className="w-9" aria-hidden />
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-2 sm:px-6 sm:pt-10">
          <h1 className="type-display max-w-2xl">Creá tu evento y conectá con marcas</h1>
          <p className="mt-2 max-w-xl type-body-muted">
            Contanos de tu experiencia, audiencia y ubicación. Cuando lo publiques, vas a poder
            invitar sponsors que encajen con tu nicho en Capital Federal.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 pb-8 pt-4 sm:px-6 lg:grid-cols-5 lg:gap-10 lg:pb-10">
          {/* Columna visual */}
          <div className="lg:col-span-2">
            <FieldLabel>Portada del evento</FieldLabel>
            <CoverUpload
              previewUrl={form.coverImage?.previewUrl}
              gradientClass={selectedGradient.class}
              title={form.title}
              onPick={setCoverImage}
              onClear={() => update({ coverImage: null })}
            />

            <div className="mt-4 max-w-sm">
              <FieldLabel>Fotos secundarias</FieldLabel>
              <p className="mb-2 text-[11px] text-muted-foreground">
                Sumá hasta 3 imágenes más para mostrar el evento
              </p>
              <div className="flex gap-2">
                {form.secondaryPhotos.map((photo, index) => (
                  <PhotoSlot
                    key={index}
                    label={`Foto ${index + 1}`}
                    previewUrl={photo?.previewUrl}
                    onPick={(file) => setSecondaryPhoto(index, file)}
                    onClear={() => clearSecondaryPhoto(index)}
                  />
                ))}
              </div>
            </div>

            {!form.coverImage?.previewUrl && (
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
            )}
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
              <p className="mt-3 type-small text-muted-foreground">
                Zona horaria: GMT-3 · Buenos Aires
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" strokeWidth={1.75} />
                <span className="text-sm font-bold text-foreground">Ubicación y formato</span>
              </div>

              <FieldLabel>Formato</FieldLabel>
              <div className="mb-5 flex flex-wrap gap-2">
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

              {showVenue && (
                <div className="space-y-4 border-t border-border-subtle pt-4">
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
                  {errors.venue && (
                    <p className="text-xs font-medium text-red-600">{errors.venue}</p>
                  )}
                </div>
              )}

              {showVirtual && (
                <div
                  className={`space-y-3 ${showVenue ? 'mt-4 border-t border-border-subtle pt-4' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                    <span className="text-xs font-bold text-foreground">Enlace virtual</span>
                  </div>
                  <FieldInput
                    value={form.virtualLink}
                    onChange={(e) => update({ virtualLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                  {errors.virtualLink && (
                    <p className="text-xs font-medium text-red-600">{errors.virtualLink}</p>
                  )}
                </div>
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

            <div>
              <FieldLabel>Perfil de la audiencia</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ audienceGender: opt.id })}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                      form.audienceGender === opt.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-white text-muted-foreground hover:border-border'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-border-subtle bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-5xl justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              Crear evento
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
