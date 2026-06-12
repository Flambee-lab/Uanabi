import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  HERO_PRODUCT_IDS,
  VITALSPORT_CATALOG,
  buildRecommendedPacks,
  catalogLabelById,
  catalogProductById,
  formatWhatsAppDisplay,
  getInvitationBrandDisplay,
  getRequirementsForScale,
  requirementLabelById,
} from '../data/invitationWizardCatalog'

const SLATE = '#0f172a'
const ELECTRIC = '#38bdf8'

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/25'

const QTY_INPUT_CLASS =
  'w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm font-semibold text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20'

function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">
        Paso {current} de {total}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              i + 1 === current ? 'w-6 bg-sky-400' : i + 1 < current ? 'w-2 bg-sky-400/50' : 'w-2 bg-slate-200',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function EventContextBar({
  brandDisplay,
  selectedEvent,
  skipEventPicker,
  step,
  hostEvents,
  selectedEventId,
  onEventChange,
}) {
  const showLockedEvent = selectedEvent && (skipEventPicker || step > 1)

  if (showLockedEvent) {
    return (
      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3">
        <p className="text-sm text-slate-700">
          Invitás a{' '}
          <strong className="font-semibold text-slate-900">{brandDisplay.name}</strong>
          {' · '}
          <strong className="font-semibold text-slate-900">{selectedEvent.title}</strong>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          {selectedEvent.date}
          {selectedEvent.location ? ` · ${selectedEvent.location}` : ''}
        </p>
      </div>
    )
  }

  if (step === 1 && !skipEventPicker) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
        <label htmlFor="event-select" className="mb-2 block text-xs font-bold text-slate-800">
          ¿A qué evento invitás a {brandDisplay.name}?
        </label>
        {hostEvents.length === 0 ? (
          <p className="text-sm text-slate-500">Creá un evento desde Mis Eventos para continuar.</p>
        ) : (
          <div className="relative">
            <select
              id="event-select"
              className={`${INPUT_CLASS} appearance-none pr-10`}
              value={selectedEventId}
              onChange={(e) => onEventChange(e.target.value)}
            >
              {hostEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} — {event.date}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        )}
      </div>
    )
  }

  return null
}

function RecommendedPackCard({ pack, selected, quantities, maxUnits, onSelect, onQuantityChange }) {
  const itemsSummary = pack.items
    .map((item) => `${item.qty}× ${catalogLabelById(item.id)}`)
    .join(' · ')

  const clampQty = (value) => Math.min(maxUnits, Math.max(1, value))

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border transition-all duration-300',
        selected
          ? 'border-sky-400 bg-sky-50/70 shadow-lg shadow-sky-400/10 ring-2 ring-sky-400/25'
          : 'border-slate-200/80 bg-white hover:border-sky-300/60 hover:shadow-md',
      )}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-center gap-4 p-4 text-left">
        <div className="flex shrink-0 -space-x-3">
          {pack.items.slice(0, 3).map((item) => {
            const product = catalogProductById(item.id)
            return (
              <span
                key={item.id}
                className="block h-12 w-12 overflow-hidden rounded-xl border-2 border-white shadow-sm"
              >
                <img src={product?.image} alt="" className="h-full w-full object-cover" />
              </span>
            )
          })}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">{pack.name}</p>
            {pack.badge && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {pack.badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{pack.description}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-600">{itemsSummary}</p>
        </div>
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition',
            selected
              ? 'border-sky-400 bg-sky-400 text-white'
              : 'border-slate-300 bg-white text-transparent',
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </button>

      {selected && (
        <div className="space-y-2.5 border-t border-sky-100 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Ajustá unidades · máx. {maxUnits} por producto
          </p>
          {pack.items.map((item) => {
            const qty = quantities[item.id] ?? item.qty
            return (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                  {catalogLabelById(item.id)}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, clampQty(qty - 1))}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-sky-300"
                    aria-label={`Menos ${catalogLabelById(item.id)}`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxUnits}
                    className={QTY_INPUT_CLASS}
                    value={qty}
                    onChange={(e) =>
                      onQuantityChange(item.id, clampQty(parseInt(e.target.value, 10) || 1))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, clampQty(qty + 1))}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-sky-300"
                    aria-label={`Más ${catalogLabelById(item.id)}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BrandHeroPanel({ brandDisplay, step }) {
  const heroProducts = HERO_PRODUCT_IDS.map(
    (id) => VITALSPORT_CATALOG.find((p) => p.id === id) ?? VITALSPORT_CATALOG[0],
  )

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden"
      style={{ backgroundColor: SLATE }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(59,130,246,0.2), transparent 55%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col p-8 xl:p-10">
        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-black text-white"
            style={{ background: `linear-gradient(135deg, ${ELECTRIC}, #2563eb)` }}
          >
            {brandDisplay.name.charAt(0)}
          </span>
          <span className="font-display text-xl font-black tracking-tight text-white">
            {brandDisplay.name}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-400">{brandDisplay.tagline}</p>

        <div className="relative mx-auto my-auto flex w-full max-w-sm items-end justify-center gap-3 py-10">
          {heroProducts.map((product, i) => (
            <div
              key={product.id}
              className={cn(
                'overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700',
                i === 1 ? 'z-10 -mt-6 w-[38%] scale-110' : 'w-[30%] opacity-90',
                i === 0 && '-rotate-6',
                i === 2 && 'rotate-6',
              )}
            >
              <img src={product.image} alt="" className="aspect-[3/4] w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <BadgeCheck className="h-4 w-4 text-sky-400" strokeWidth={2.2} />
            Marca verificada por UANABI
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            {step === 1 && 'Te sugerimos packs con cantidades a la medida de tu evento.'}
            {step === 2 && 'Contanos qué entregables podés ofrecer a cambio.'}
            {step === 3 && 'Validá fechas, punto de entrega y contacto.'}
            {step === 4 && 'Enviá tu propuesta — la marca decide si la acepta.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryBlock({ title, items, note, className }) {
  return (
    <div className={cn('rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5', className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">{title}</p>
      {items.length === 0 && !note ? (
        <p className="mt-1.5 text-[13px] text-slate-400">Sin selección</p>
      ) : (
        <ul className="mt-1.5 space-y-1">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-[13px] leading-snug text-slate-800">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      )}
      {note && (
        <p className="mt-2 text-[13px] leading-snug text-slate-600">
          <span className="font-semibold text-slate-500">Pedido especial: </span>
          {note}
        </p>
      )}
    </div>
  )
}

export default function InvitationWizard({
  isOpen,
  brand,
  hostEvents = [],
  activeEvent = null,
  hostProfile = null,
  onClose,
  onSubmit,
  saving = false,
}) {
  const skipEventPicker = Boolean(activeEvent?.id)
  const brandDisplay = getInvitationBrandDisplay(brand)
  const totalSteps = 4
  const savedWhatsApp = hostProfile?.whatsapp?.trim() ?? ''

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [selectedEventId, setSelectedEventId] = useState(activeEvent?.id ?? '')
  const [selectedPackId, setSelectedPackId] = useState(null)
  const [productQty, setProductQty] = useState({})
  const [specialRequest, setSpecialRequest] = useState('')
  const [requirements, setRequirements] = useState([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [extraMessage, setExtraMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedEvent = useMemo(() => {
    if (activeEvent?.id) return activeEvent
    return hostEvents.find((e) => e.id === selectedEventId) ?? null
  }, [activeEvent, hostEvents, selectedEventId])

  const recommendation = useMemo(() => buildRecommendedPacks(selectedEvent), [selectedEvent])

  const scaledRequirements = useMemo(
    () => getRequirementsForScale(recommendation.scale),
    [recommendation.scale],
  )

  const productLines = useMemo(
    () =>
      Object.entries(productQty)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => `${qty}× ${catalogLabelById(id)}`),
    [productQty],
  )

  const requirementLabels = useMemo(
    () => requirements.map(requirementLabelById),
    [requirements],
  )

  useEffect(() => {
    if (!isOpen) return
    setStep(1)
    setDirection(1)
    setSelectedEventId(activeEvent?.id ?? hostEvents[0]?.id ?? '')
    setSelectedPackId(null)
    setProductQty({})
    setSpecialRequest('')
    setRequirements([])
    setDeliveryDate('')
    setDeliveryAddress('')
    setWhatsapp(savedWhatsApp)
    setExtraMessage('')
    setSubmitting(false)
  }, [isOpen, activeEvent?.id, hostEvents, brand?.id, savedWhatsApp])

  useEffect(() => {
    if (!selectedEvent) return
    const venue = selectedEvent.venueAddress ?? selectedEvent.location ?? ''
    setDeliveryAddress((prev) => (prev.trim() ? prev : venue))
  }, [selectedEvent?.id, selectedEvent?.venueAddress, selectedEvent?.location])

  // Si cambia el evento, recalcula las cantidades del pack elegido
  useEffect(() => {
    if (!selectedPackId) return
    const pack = recommendation.packs.find((p) => p.id === selectedPackId)
    if (!pack) {
      setSelectedPackId(null)
      setProductQty({})
      return
    }
    setProductQty(Object.fromEntries(pack.items.map((i) => [i.id, i.qty])))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar de evento
  }, [selectedEvent?.id])

  if (!isOpen || !brand) return null

  const hasProducts = productLines.length > 0
  const canContinueStep1 =
    Boolean(selectedEvent?.id) && (hasProducts || specialRequest.trim().length > 0)
  const canContinueStep2 = requirements.length > 0
  const canContinueStep3 =
    Boolean(deliveryDate) && Boolean(deliveryAddress.trim()) && Boolean(whatsapp.trim())

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const selectPack = (pack) => {
    if (selectedPackId === pack.id) {
      setSelectedPackId(null)
      setProductQty({})
      return
    }
    setSelectedPackId(pack.id)
    setProductQty(Object.fromEntries(pack.items.map((i) => [i.id, i.qty])))
  }

  const setQuantity = (id, qty) => {
    setProductQty((prev) => ({ ...prev, [id]: qty }))
  }

  const toggleRequirement = (id) => {
    setRequirements((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleConfirm = async () => {
    if (!selectedEvent || submitting || saving) return
    setSubmitting(true)
    try {
      const productos = [...productLines]
      if (specialRequest.trim()) {
        productos.push(`Pedido especial: ${specialRequest.trim()}`)
      }

      await onSubmit?.({
        event: selectedEvent,
        brand: brandDisplay,
        productosSolicitados: productos,
        entregablesOfrecidos: requirementLabels,
        fechaLimiteEntrega: deliveryDate,
        mensajeExtra: extraMessage.trim(),
        cantidadEstimada: productLines.join(', '),
        direccionEntrega: deliveryAddress.trim(),
        whatsapp: whatsapp.trim(),
      })
      onClose?.()
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting || saving

  const stepHeadings = {
    1: 'Packs sugeridos para tu evento',
    2: '¿Qué entregás vos a cambio?',
    3: 'Validá la logística',
    4: 'Tu propuesta está lista',
  }

  const stepSubtitles = {
    1: 'Calculamos cantidades en base a la asistencia estimada de tu evento.',
    2: 'Opciones ajustadas al tamaño de tu evento — elegí las que puedas cumplir.',
    3: 'Fecha de stock, punto de entrega y contacto.',
    4: 'Revisala antes de enviarla — la marca decide si la acepta.',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[backdrop-enter_0.2s_ease-out]"
      style={{ backgroundColor: SLATE }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitation-wizard-title"
    >
      <aside className="hidden min-h-0 w-[42%] shrink-0 lg:block xl:w-[44%]">
        <BrandHeroPanel brandDisplay={brandDisplay} step={step} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative h-28 shrink-0 overflow-hidden lg:hidden">
          <BrandHeroPanel brandDisplay={brandDisplay} step={step} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <div className="animate-modal-enter flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-black/20">
            <div className="flex shrink-0 flex-col border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sky-500">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Propuesta a marca
                    </span>
                  </div>
                  <h2
                    id="invitation-wizard-title"
                    className="mt-2 font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl"
                  >
                    {stepHeadings[step]}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{stepSubtitles[step]}</p>

                  {(step === 1 || selectedEvent) && (
                    <EventContextBar
                      brandDisplay={brandDisplay}
                      selectedEvent={selectedEvent}
                      skipEventPicker={skipEventPicker}
                      step={step}
                      hostEvents={hostEvents}
                      selectedEventId={selectedEventId}
                      onEventChange={setSelectedEventId}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div
                key={step}
                className={cn(
                  'wizard-step-enter',
                  direction > 0 ? 'wizard-step-forward' : 'wizard-step-back',
                )}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">
                          Recomendado por UANABI
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                          <Users className="h-3 w-3" />
                          ~{recommendation.attendance} asistentes · {recommendation.scaleLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Armamos estos packs del catálogo de {brandDisplay.name} según la asistencia
                        de tu evento — así no pedís ni de más ni de menos.
                      </p>
                      <div className="mt-4 space-y-3">
                        {recommendation.packs.map((pack) => (
                          <RecommendedPackCard
                            key={pack.id}
                            pack={pack}
                            selected={selectedPackId === pack.id}
                            quantities={productQty}
                            maxUnits={recommendation.maxUnits}
                            onSelect={() => selectPack(pack)}
                            onQuantityChange={setQuantity}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="special-request" className="mb-2 block text-xs font-bold text-slate-800">
                        Pedidos especiales{' '}
                        <span className="font-normal text-slate-400">(opcional)</span>
                      </label>
                      <input
                        id="special-request"
                        type="text"
                        className={INPUT_CLASS}
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        placeholder='Ej: "Sabor limón si hay disponible" o algo fuera del pack'
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">Entregables que ofrecés</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                          Sugerido para un {recommendation.scaleLabel.toLowerCase()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Mostramos solo lo que se ajusta al tamaño de tu evento — elegí lo que
                        realmente podés cumplir.
                      </p>
                      <ul className="mt-4 space-y-2">
                        {scaledRequirements.map((item) => {
                          const checked = requirements.includes(item.id)
                          return (
                            <li key={item.id}>
                              <label
                                className={cn(
                                  'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition',
                                  checked
                                    ? 'border-sky-300 bg-sky-50/80 ring-1 ring-sky-400/20'
                                    : 'border-slate-200 bg-white hover:border-sky-200',
                                )}
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                                  checked={checked}
                                  onChange={() => toggleRequirement(item.id)}
                                />
                                <span className="text-sm font-medium text-slate-800">{item.label}</span>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="delivery-date" className="mb-2 block text-xs font-bold text-slate-800">
                          ¿Para cuándo necesitás el stock?
                        </label>
                        <input
                          id="delivery-date"
                          type="date"
                          className={INPUT_CLASS}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="delivery-address" className="mb-2 block text-xs font-bold text-slate-800">
                          Dirección / punto de entrega
                        </label>
                        <input
                          id="delivery-address"
                          type="text"
                          className={INPUT_CLASS}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Ej: Av. Corrientes 1234, CABA"
                        />
                        <p className="mt-1.5 text-[11px] text-slate-400">
                          Precargamos la dirección del venue — podés cambiarla si recibís en otro
                          punto.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
                      <div className="flex gap-3">
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <p className="text-xs leading-relaxed text-emerald-950/85">
                          <strong className="font-bold">Canal de contacto.</strong> La marca te
                          escribe por WhatsApp — confirmá que el número de tu perfil sea correcto.
                        </p>
                      </div>
                      <div className="mt-3">
                        <label htmlFor="invitation-whatsapp" className="mb-2 block text-xs font-bold text-slate-800">
                          WhatsApp comercial *
                        </label>
                        <div className="relative">
                          <MessageCircle className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            id="invitation-whatsapp"
                            type="tel"
                            className={cn(
                              `${INPUT_CLASS} pl-10`,
                              savedWhatsApp && 'cursor-not-allowed bg-slate-100 text-slate-500',
                            )}
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="11 2345 6789"
                            autoComplete="tel"
                            readOnly={Boolean(savedWhatsApp)}
                          />
                          {savedWhatsApp && (
                            <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <Check className="h-3 w-3" strokeWidth={3} />
                              Desde tu perfil
                            </span>
                          )}
                        </div>
                        {savedWhatsApp && (
                          <p className="mt-1.5 text-[11px] text-slate-500">
                            Si necesitás cambiarlo, editalo desde tu perfil de host.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="extra-message" className="mb-2 block text-xs font-bold text-slate-800">
                        Notas de logística{' '}
                        <span className="font-normal text-slate-400">(opcional)</span>
                      </label>
                      <textarea
                        id="extra-message"
                        className={`${INPUT_CLASS} min-h-[96px] resize-y`}
                        value={extraMessage}
                        onChange={(e) => setExtraMessage(e.target.value)}
                        placeholder="Accesos para camión, heladera, restricciones del venue..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="mx-auto max-w-2xl space-y-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50 to-white px-5 py-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-500">
                        <Send className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-sm font-black text-slate-900">
                          Estás por enviar una propuesta
                        </h3>
                        <p className="mt-0.5 text-xs leading-snug text-slate-600">
                          No confirma el patrocinio: {brandDisplay.name} puede{' '}
                          <strong className="font-semibold text-slate-800">aceptar o declinar</strong>.
                          Te avisamos por WhatsApp y en la plataforma.
                        </p>
                      </div>
                      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                          <Clock className="h-3 w-3 text-sky-500" />
                          Hasta 7 días hábiles
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                          <MessageCircle className="h-3 w-3 text-emerald-600" />
                          Aviso por WhatsApp
                        </span>
                      </div>
                    </div>

                    <div
                      className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg"
                      style={{ backgroundColor: SLATE }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/10 px-5 py-3.5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                            Resumen de la propuesta
                          </p>
                          <p className="mt-0.5 font-display text-base font-black text-white">
                            Proponés a {brandDisplay.name}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400">
                          {selectedEvent?.title} · {selectedEvent?.date}
                        </p>
                      </div>
                      <div className="grid gap-3 bg-white p-4 sm:grid-cols-2">
                        <SummaryBlock
                          title="Le pedís a la marca"
                          items={productLines}
                          note={specialRequest.trim() || null}
                        />
                        <SummaryBlock title="Ofrecés a cambio" items={requirementLabels} />
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
                            Logística
                          </p>
                          <div className="mt-1.5 grid gap-x-4 gap-y-1 text-[13px] leading-snug text-slate-800 sm:grid-cols-3">
                            <p>
                              <span className="text-slate-500">Stock para el: </span>
                              {deliveryDate
                                ? new Date(`${deliveryDate}T12:00:00`).toLocaleDateString('es-AR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </p>
                            <p>
                              <span className="text-slate-500">Entrega en: </span>
                              {deliveryAddress || '—'}
                            </p>
                            <p>
                              <span className="text-slate-500">WhatsApp: </span>
                              {formatWhatsAppDisplay(whatsapp) || '—'}
                            </p>
                          </div>
                          {extraMessage.trim() && (
                            <p className="mt-2 text-[13px] leading-snug text-slate-600">
                              <span className="font-semibold text-slate-500">Nota: </span>
                              {extraMessage.trim()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 sm:px-8">
              <StepDots current={step} total={totalSteps} />

              <div className="flex items-center gap-2">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    className="rounded-full border-slate-200"
                    onClick={() => goTo(step - 1)}
                    disabled={busy}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    className="rounded-full border-slate-200"
                    onClick={onClose}
                    disabled={busy}
                  >
                    Cancelar
                  </Button>
                )}

                {step === 1 && (
                  <Button
                    type="button"
                    size="default"
                    className="rounded-full bg-sky-400 px-6 text-slate-900 hover:bg-sky-300"
                    disabled={!canContinueStep1 || busy}
                    onClick={() => goTo(2)}
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 2 && (
                  <Button
                    type="button"
                    size="default"
                    className="rounded-full bg-sky-400 px-6 text-slate-900 hover:bg-sky-300"
                    disabled={!canContinueStep2 || busy}
                    onClick={() => goTo(3)}
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 3 && (
                  <Button
                    type="button"
                    size="default"
                    className="rounded-full bg-sky-400 px-6 text-slate-900 hover:bg-sky-300"
                    disabled={!canContinueStep3 || busy}
                    onClick={() => goTo(4)}
                  >
                    Ver resumen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 4 && (
                  <Button
                    type="button"
                    size="default"
                    className="rounded-full bg-sky-400 px-6 font-bold text-slate-900 hover:bg-sky-300"
                    disabled={busy}
                    onClick={handleConfirm}
                  >
                    {busy ? 'Enviando…' : 'Enviar propuesta'}
                  </Button>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
