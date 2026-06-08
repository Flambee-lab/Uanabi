import { useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarPlus,
  Camera,
  CheckCircle2,
  MapPin,
  Share2,
  UserRound,
} from 'lucide-react'
import HostRegistrationIllustration from '../components/onboarding/HostRegistrationIllustration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { cn } from '@/lib/utils'
import { WizardInput } from '../components/profile/wizard/WizardInputGroup'
import {
  getProfileInitial,
  HOST_LOCATION,
  mergeProfileForSave,
  seedProfileFromAuth,
} from '../data/hostProfile'

const HOST_COUNTRY = 'Argentina'

const CABA_DISCLAIMER =
  'Por ahora las marcas en la plataforma operan únicamente en Capital Federal (CABA). Próximamente más zonas.'

const FORM_STEPS = [
  {
    id: 'profile',
    icon: UserRound,
    kicker: 'Paso 1 de 3',
    title: 'Completa tu perfil',
    description: 'Tu información básica para que las marcas te conozcan.',
    tip: 'Podés actualizar tu foto más adelante desde tu perfil.',
  },
  {
    id: 'social',
    icon: Share2,
    kicker: 'Paso 2 de 3',
    title: 'Conecta tus redes sociales',
    description: 'Compartí tus perfiles públicos para que las marcas vean tu alcance y estilo.',
    tip: 'Todas las redes son opcionales — podés sumarlas cuando quieras.',
  },
  {
    id: 'event',
    icon: CalendarPlus,
    kicker: 'Paso 3 de 3',
    title: '¿Tenés un evento para publicar?',
    description: 'Elegí cómo querés continuar con tus primeros pasos en la plataforma.',
    tip: 'Siempre podés crear eventos después desde tu panel principal.',
  },
]

const SOCIAL_FIELDS = [
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: '@tuusuario',
    hint: 'Usuario o link — ej: @milena.onbrand o instagram.com/milena.onbrand',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    placeholder: '@tuusuario',
    hint: 'Usuario o link — ej: @milenaonbrand o tiktok.com/@milenaonbrand',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    placeholder: 'Nombre del canal o URL',
    hint: 'Canal o link — ej: youtube.com/@tucanal',
  },
  {
    id: 'twitch',
    label: 'Twitch',
    placeholder: '@tuusuario',
    hint: 'Usuario o link — ej: twitch.tv/tuusuario',
  },
  {
    id: 'twitter',
    label: 'X',
    placeholder: '@tuusuario',
    hint: 'Usuario o link — ej: @milenaonbrand o x.com/milenaonbrand',
  },
]

function ProgressDots({ step, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < step ? 'h-1.5 w-8 bg-primary' : i === step ? 'h-1.5 w-5 bg-primary/40' : 'h-1.5 w-3 bg-border'
          }`}
        />
      ))}
    </div>
  )
}

function splitName(fullName) {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function splitCity(location) {
  const value = (location ?? '').trim()
  if (!value || value === HOST_LOCATION) return ''
  const withoutCountry = value.replace(/,?\s*Argentina\s*$/i, '').trim()
  if (!withoutCountry || withoutCountry === HOST_LOCATION) return ''
  return withoutCountry
}

function initForm(profile) {
  const { firstName, lastName } = splitName(profile.fullName)

  return {
    firstName,
    lastName,
    city: splitCity(profile.location),
    avatarUrl: profile.avatarUrl ?? null,
    instagram: profile.instagram ?? '',
    tiktok: profile.tiktok ?? '',
    youtube: profile.youtube ?? '',
    twitch: profile.twitch ?? '',
    twitter: profile.twitter ?? '',
    eventChoice: null,
  }
}

function SelectionCard({ selected, onClick, title, description, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border p-5 text-left transition',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border-subtle bg-secondary/30 hover:border-border',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            selected ? 'bg-primary text-white' : 'bg-card text-primary',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-black text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}

export default function HostRegistrationWizard({
  profile,
  authUser,
  onComplete,
  onSkipToDashboard,
}) {
  const seededProfile = useMemo(
    () => seedProfileFromAuth(profile, authUser),
    [profile, authUser],
  )
  const [showWelcome, setShowWelcome] = useState(true)
  const [showComplete, setShowComplete] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(() => initForm(seededProfile))
  const [errors, setErrors] = useState({})
  const avatarInputRef = useRef(null)

  const greeting = authUser?.fullName?.trim()
    ? authUser.fullName.split(' ')[0]
    : null

  const current = FORM_STEPS[stepIndex]
  const Icon = current.icon
  const illustrationStepId = showComplete ? 'complete' : current.id

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const buildProfile = () => {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
    const city = form.city.trim() || HOST_LOCATION
    const location = `${city}, ${HOST_COUNTRY}`

    return mergeProfileForSave(
      seededProfile,
      {
        fullName,
        avatarUrl: form.avatarUrl,
        location,
        instagram: form.instagram.trim(),
        tiktok: form.tiktok.trim(),
        youtube: form.youtube.trim(),
        twitch: form.twitch.trim(),
        twitter: form.twitter.trim(),
      },
      { skipValidation: true },
    )
  }

  const validateProfileStep = () => {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'Ingresá tu nombre'
    if (!form.lastName.trim()) next.lastName = 'Ingresá tu apellido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleAvatar = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => {
      if (prev.avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.avatarUrl)
      return { ...prev, avatarUrl: url }
    })
  }

  const goNext = () => {
    if (stepIndex < FORM_STEPS.length - 1) {
      setStepIndex((s) => s + 1)
      setErrors({})
    }
  }

  const handleProfileContinue = () => {
    if (!validateProfileStep()) return
    goNext()
  }

  const handleSocialContinue = () => goNext()

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1)
      setErrors({})
    }
  }

  const canContinueProfile = Boolean(form.firstName.trim() && form.lastName.trim())
  const canFinalizeEvent = form.eventChoice !== null

  const handleFinalize = () => {
    if (!canFinalizeEvent) return

    if (form.eventChoice === 'create') {
      onComplete?.(buildProfile(), { openCreateEvent: true })
      return
    }

    setShowComplete(true)
  }

  const handleGoToDashboard = () => {
    onComplete?.(buildProfile(), { openCreateEvent: false })
  }

  const profileInitial = getProfileInitial({
    fullName: `${form.firstName} ${form.lastName}`.trim(),
  })

  if (showWelcome) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <HostRegistrationIllustration
          stepId="welcome"
          hero
          greeting={greeting}
          heroActions={
            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                size="lg"
                className="h-12 w-full px-8 text-base"
                onClick={() => setShowWelcome(false)}
              >
                Empecemos
                <ArrowRight data-icon="inline-end" className="h-4 w-4" />
              </Button>
              {onSkipToDashboard && (
                <button
                  type="button"
                  onClick={onSkipToDashboard}
                  className="text-sm font-semibold text-white/55 transition hover:text-white/90"
                >
                  Omitir e ir al Dashboard
                </button>
              )}
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <aside className="hidden min-h-0 w-[44%] shrink-0 lg:block xl:w-[46%]">
        <HostRegistrationIllustration
          stepId={illustrationStepId}
          imageSrc={current.id === 'profile' ? form.avatarUrl : undefined}
        />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative h-32 shrink-0 overflow-hidden lg:hidden">
          <HostRegistrationIllustration
            stepId={illustrationStepId}
            compact
            imageSrc={current.id === 'profile' ? form.avatarUrl : undefined}
          />
        </div>

        <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-5 shrink-0">
            <Badge variant="secondary">Registro de Host</Badge>
            <div className="mt-4">
              <ProgressDots
                step={showComplete ? FORM_STEPS.length : stepIndex}
                total={FORM_STEPS.length}
              />
            </div>
          </div>

          <Card className="flex min-h-0 flex-1 flex-col border-border-subtle shadow-sm">
            {showComplete ? (
              <>
                <CardHeader className="border-b border-border-subtle text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <CardTitle className="font-display text-xl font-black tracking-tight sm:text-2xl">
                    ¡Todo listo! 🎉
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Tu perfil fue configurado correctamente.
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col items-center justify-center pt-6 text-center">
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Ya podés explorar la plataforma, conectar con marcas y gestionar tus eventos desde
                    el panel principal.
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 border-t border-border-subtle bg-muted/30 sm:flex-row sm:justify-center">
                  <Button type="button" size="lg" className="w-full sm:w-auto" onClick={handleGoToDashboard}>
                    Ir al panel principal
                    <ArrowRight data-icon="inline-end" className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader className="border-b border-border-subtle">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="type-label text-primary">{current.kicker}</p>
                  <CardTitle className="font-display text-xl font-black tracking-tight sm:text-2xl">
                    {current.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {current.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="min-h-0 flex-1 overflow-y-auto pt-5">
                  {current.id === 'profile' && (
                    <div className="space-y-5">
                      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatar(e.target.files?.[0])}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="group relative shrink-0"
                        >
                          {form.avatarUrl ? (
                            <img
                              src={form.avatarUrl}
                              alt=""
                              className="h-24 w-24 rounded-2xl object-cover shadow-sm ring-1 ring-border-subtle"
                            />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-black text-white shadow-sm">
                              {profileInitial}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-card text-muted-foreground shadow-sm transition group-hover:text-foreground">
                            <Camera className="h-3.5 w-3.5" strokeWidth={2} />
                          </span>
                        </button>
                        <div className="text-center sm:text-left">
                          <p className="text-sm font-bold text-foreground">Foto de perfil</p>
                          <p className="mt-1 text-xs text-muted-foreground">Opcional — podés cambiarla después</p>
                        </div>
                      </div>

                      <FormField
                        id="host-firstName"
                        label="Nombre"
                        error={errors.firstName}
                        required
                      >
                        <WizardInput
                          id="host-firstName"
                          value={form.firstName}
                          onChange={(e) => updateForm({ firstName: e.target.value })}
                          placeholder="Ej: Milena"
                          autoFocus
                        />
                      </FormField>

                      <FormField
                        id="host-lastName"
                        label="Apellido"
                        error={errors.lastName}
                        required
                      >
                        <WizardInput
                          id="host-lastName"
                          value={form.lastName}
                          onChange={(e) => updateForm({ lastName: e.target.value })}
                          placeholder="Ej: Miranda"
                        />
                      </FormField>

                      <FormField
                        id="host-city"
                        label="Ciudad"
                        hint="Ej: Buenos Aires, CABA, Palermo..."
                      >
                        <WizardInput
                          id="host-city"
                          value={form.city}
                          onChange={(e) => updateForm({ city: e.target.value })}
                          placeholder="Ej: Buenos Aires"
                        />
                      </FormField>

                      <FormField id="host-country" label="País">
                        <WizardInput
                          id="host-country"
                          value={HOST_COUNTRY}
                          readOnly
                          aria-readonly
                          className="cursor-not-allowed bg-secondary text-muted-foreground"
                        />
                      </FormField>

                      <div className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-800/70" strokeWidth={1.75} />
                        <p className="text-xs leading-relaxed text-amber-950/80">{CABA_DISCLAIMER}</p>
                      </div>
                    </div>
                  )}

                  {current.id === 'social' && (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-border-subtle bg-secondary/50 px-4 py-3">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          <strong className="font-semibold text-foreground">No vinculamos cuentas.</strong>{' '}
                          Solo pegá tu usuario (<span className="font-medium">@tucuenta</span>) o el link
                          público de cada red. Las marcas lo verán en tu perfil para conocerte mejor.
                        </p>
                      </div>

                      {SOCIAL_FIELDS.map((field) => (
                        <FormField
                          key={field.id}
                          id={`host-${field.id}`}
                          label={field.label}
                          hint={field.hint}
                        >
                          <WizardInput
                            id={`host-${field.id}`}
                            value={form[field.id]}
                            onChange={(e) => updateForm({ [field.id]: e.target.value })}
                            placeholder={field.placeholder}
                          />
                        </FormField>
                      ))}
                    </div>
                  )}

                  {current.id === 'event' && (
                    <div className="space-y-4">
                      <SelectionCard
                        selected={form.eventChoice === 'create'}
                        onClick={() => updateForm({ eventChoice: 'create' })}
                        title="Crear evento"
                        description="Abrís el formulario de publicación y cargás tu primer evento."
                        icon={CalendarPlus}
                      />
                      <SelectionCard
                        selected={form.eventChoice === 'skip'}
                        onClick={() => updateForm({ eventChoice: 'skip' })}
                        title="Continuar sin evento"
                        description="Podrás crear eventos más adelante desde tu panel principal."
                        icon={ArrowRight}
                      />
                    </div>
                  )}

                  {current.tip && (
                    <p className="type-small mt-5 text-muted-foreground">{current.tip}</p>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 border-t border-border-subtle bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {stepIndex > 0 ? (
                      <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
                        ← Atrás
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowWelcome(true)}
                      >
                        ← Bienvenida
                      </Button>
                    )}
                  </div>

                  {current.id === 'profile' && (
                    <Button
                      type="button"
                      size="lg"
                      disabled={!canContinueProfile}
                      onClick={handleProfileContinue}
                    >
                      Continuar
                      <ArrowRight data-icon="inline-end" className="h-4 w-4" />
                    </Button>
                  )}

                  {current.id === 'social' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={handleSocialContinue}>
                        Agregar más tarde
                      </Button>
                      <Button type="button" size="lg" onClick={handleSocialContinue}>
                        Continuar
                        <ArrowRight data-icon="inline-end" className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {current.id === 'event' && (
                    <Button
                      type="button"
                      size="lg"
                      disabled={!canFinalizeEvent}
                      onClick={handleFinalize}
                    >
                      {form.eventChoice === 'create' ? 'Ir a crear evento' : 'Finalizar'}
                      <ArrowRight data-icon="inline-end" className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
