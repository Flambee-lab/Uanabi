import { useState } from 'react'
import { Loader2, MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { WizardInput, WizardInputGroup } from './WizardInputGroup'
import {
  createEmptyCollaboration,
  HOST_LOCATION,
  HOST_LOCATION_HINT,
  mergeProfileForSave,
  validateProfileEssentials,
} from '../../../data/hostProfile'
import IdentityTagPills from '../IdentityTagPills'
import ProfileEditCollaborations from '../ProfileEditCollaborations'
import { ProfileField, profileInputClass } from './ProfileField'
import ProfileWizardTip from './ProfileWizardTip'

const TOTAL_STEPS = 3

const STEP_TIPS = {
  1: {
    default: (
      <>
        💡 Ningún campo es obligatorio. Podés omitir este paso y completar nombre, WhatsApp o tags más
        tarde desde Profile Settings.
      </>
    ),
    mandatory: (
      <>
        💡 Nombre, WhatsApp y al menos un tag son indispensables. Es la base para que las marcas te
        contacten sin fricción.
      </>
    ),
  },
  2: {
    default: (
      <>
        Si aún no tenés métricas finales, usá <strong>[ Omitir paso ]</strong> y completalo más
        tarde desde Profile Settings.
      </>
    ),
    mandatory: (
      <>
        Sumá tus redes y métricas si las tenés. Si no, seguí al siguiente paso — podés editarlo
        después desde Perfil.
      </>
    ),
  },
  3: {
    default: (
      <>
        Las colaboraciones con marcas, links y fotos de evidencia son tu mejor carta de presentación
        ante nuevos sponsors.
      </>
    ),
    mandatory: (
      <>
        Si ya trabajaste con marcas, contalo acá. Si no, dejalo vacío y finalizá — tu perfil ya
        queda listo para explorar Uanabi.
      </>
    ),
  },
}

function ProgressBar({ step, mandatory, compact }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`rounded-full transition-colors duration-300 ${
            compact ? 'h-1 w-12' : 'h-1.5 w-16'
          } ${i < step ? 'bg-primary' : 'bg-border'}`}
        />
      ))}
      {mandatory && (
        <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
          Paso {step}/{TOTAL_STEPS}
        </Badge>
      )}
    </div>
  )
}

function initForm(profile) {
  const stories = profile.successStories ?? []
  return {
    fullName: profile.fullName ?? '',
    displayName: profile.displayName ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? HOST_LOCATION,
    categories: profile.categories?.length ? [...profile.categories] : [],
    instagram: profile.instagram ?? '',
    tiktok: profile.tiktok ?? '',
    whatsapp: profile.whatsapp ?? '',
    socialMetrics: {
      totalFollowers: profile.socialMetrics?.totalFollowers ?? '',
      engagementPercent: profile.socialMetrics?.engagementPercent ?? '',
    },
    successStories: stories.length > 0 ? stories : [createEmptyCollaboration()],
  }
}

function OnboardingCollabBrief({ item, onChange }) {
  return (
    <div className="space-y-5">
      <FormField id="colab-title" label="Título de colaboración">
        <WizardInput
          id="colab-title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ej: Patrocinio — Neon LAN 2025"
        />
      </FormField>
      <FormField
        id="colab-link"
        label="Link de referencia"
        hint="Opcional — Drive, Instagram, press kit, etc."
      >
        <WizardInput
          id="colab-link"
          value={item.referenceLink}
          onChange={(e) => onChange({ referenceLink: e.target.value })}
          placeholder="https://drive.google.com/..."
        />
      </FormField>
    </div>
  )
}

export default function ProfileWizard({
  profile,
  onSave,
  onSkip,
  onCancel,
  isEdit,
  mandatory = false,
  fitViewport = false,
  onPersistStep,
  saving = false,
}) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => initForm(profile))
  const [errors, setErrors] = useState({})
  const [stepSaving, setStepSaving] = useState(false)

  const compact = mandatory && fitViewport
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))
  const updateMetrics = (patch) =>
    setForm((prev) => ({
      ...prev,
      socialMetrics: { ...prev.socialMetrics, ...patch },
    }))

  const validateStep1 = () => {
    const next = validateProfileEssentials(form)
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const persistCurrentStep = async () => {
    if (!onPersistStep) return
    setStepSaving(true)
    try {
      await onPersistStep(form, step)
    } finally {
      setStepSaving(false)
    }
  }

  const saveProfile = async ({ skipValidation = !mandatory } = {}) => {
    if (mandatory && !validateStep1()) {
      setStep(1)
      return
    }
    const cleaned = form.successStories.filter((s) => s.title?.trim())
    const payload = mergeProfileForSave(
      profile,
      {
        ...form,
        successStories: cleaned.length > 0 ? cleaned : form.successStories,
      },
      { skipValidation },
    )

    if (onPersistStep) {
      setStepSaving(true)
      try {
        await onPersistStep(form, step)
      } finally {
        setStepSaving(false)
      }
    }

    await onSave?.(payload)
  }

  const handleNext = async () => {
    if (mandatory && step === 1 && !validateStep1()) return
    if (step < TOTAL_STEPS) {
      try {
        await persistCurrentStep()
        setStep((s) => s + 1)
        setErrors({})
      } catch {
        setErrors({ form: 'No pudimos guardar el paso. Intentá de nuevo.' })
      }
    }
  }

  const handleSkipStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      setErrors({})
    } else {
      saveProfile()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      setErrors({})
    } else if (isEdit && onCancel) {
      onCancel()
    }
  }

  const handlePublish = async (e) => {
    e.preventDefault()
    try {
      await saveProfile()
    } catch {
      setErrors({ form: 'No pudimos guardar tu perfil. Intentá de nuevo.' })
    }
  }

  const busy = saving || stepSaving

  const handleSkipAll = () => {
    onSkip?.(mergeProfileForSave(profile, form, { skipValidation: true }))
  }

  const stepTitles = {
    1: mandatory ? 'Quién sos como Host' : 'Contanos sobre vos',
    2: 'Tus Canales Digitales',
    3: mandatory ? 'Tu historial con marcas' : 'Casos de Éxito / Sponsors Pasados',
  }

  const tipKey = mandatory ? 'mandatory' : 'default'
  const showStepSkip = !mandatory && (step === 2 || step === 3)

  const renderInput = (props, extraClass = '') => {
    if (mandatory || fitViewport) {
      return <WizardInput className={extraClass || undefined} {...props} />
    }
    return <input className={`${profileInputClass} ${extraClass}`.trim()} {...props} />
  }

  const stepOneFields = compact ? (
    <div className="space-y-5">
      <FormField
        id="wizard-fullName"
        label="Nombre completo"
        required
        error={errors.name}
      >
        <WizardInput
          id="wizard-fullName"
          value={form.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          placeholder="Celeste Rojas"
          autoFocus
        />
      </FormField>

      <FormField
        id="wizard-displayName"
        label="Nombre público del Host / colectivo"
        hint="Cómo te van a ver las marcas en tu perfil público"
      >
        <WizardInput
          id="wizard-displayName"
          value={form.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
          placeholder="Ej: Neon Collective"
        />
      </FormField>

      <FormField
        id="wizard-whatsapp"
        label="WhatsApp comercial"
        required
        hint="Vía directa para cerrar patrocinios"
        error={errors.whatsapp}
      >
        <WizardInputGroup icon={MessageCircle}>
          <WizardInput
            id="wizard-whatsapp"
            hasIcon
            value={form.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
            placeholder="11 2345 6789"
            type="tel"
          />
        </WizardInputGroup>
      </FormField>

      <FormField id="wizard-location" label="Ubicación" hint={HOST_LOCATION_HINT}>
        <WizardInputGroup icon={MapPin}>
          <WizardInput
            id="wizard-location"
            hasIcon
            className="cursor-not-allowed bg-secondary text-muted-foreground"
            value={HOST_LOCATION}
            readOnly
            aria-readonly
          />
        </WizardInputGroup>
      </FormField>

      <FormField
        id="wizard-tags"
        label="Tags de identificación"
        required
        hint="Seleccioná las categorías que definen tu perfil ante las marcas"
        error={errors.tags}
      >
        <IdentityTagPills
          selected={form.categories}
          onChange={(categories) => update({ categories })}
        />
      </FormField>
    </div>
  ) : (
    <div className="space-y-6">
      <ProfileField label="Nombre completo">
        {renderInput({
          value: form.fullName,
          onChange: (e) => update({ fullName: e.target.value }),
          placeholder: 'Celeste Rojas',
          autoFocus: true,
        })}
      </ProfileField>
      {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}

      <ProfileField label="Nombre público del Host / colectivo">
        {renderInput({
          value: form.displayName,
          onChange: (e) => update({ displayName: e.target.value }),
          placeholder: 'Ej: Neon Collective',
        })}
      </ProfileField>

      <ProfileField label="WhatsApp comercial">
        <div className="relative">
          <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {renderInput({
            className: 'pl-10',
            value: form.whatsapp,
            onChange: (e) => update({ whatsapp: e.target.value }),
            placeholder: '11 2345 6789',
            type: 'tel',
          })}
        </div>
      </ProfileField>
      {errors.whatsapp && (
        <p className="text-xs font-medium text-destructive">{errors.whatsapp}</p>
      )}

      <ProfileField label="Ubicación">
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {renderInput({
            className: 'cursor-not-allowed bg-secondary pl-10 text-muted-foreground',
            value: HOST_LOCATION,
            readOnly: true,
            'aria-readonly': true,
          })}
        </div>
        <p className="type-small text-muted-foreground">{HOST_LOCATION_HINT}</p>
      </ProfileField>

      <ProfileField
        label="Tags de identificación"
        hint="Seleccioná las categorías que definen tu perfil ante las marcas"
      >
        <IdentityTagPills
          selected={form.categories}
          onChange={(categories) => update({ categories })}
        />
      </ProfileField>
      {errors.tags && <p className="text-xs font-medium text-destructive">{errors.tags}</p>}
    </div>
  )

  const stepTwoFields = compact ? (
    <div className="space-y-5">
      <FormField id="wizard-instagram" label="Instagram">
        <WizardInput
          id="wizard-instagram"
          value={form.instagram}
          onChange={(e) => update({ instagram: e.target.value })}
          placeholder="@tuusuario o URL"
        />
      </FormField>
      <FormField id="wizard-tiktok" label="TikTok">
        <WizardInput
          id="wizard-tiktok"
          value={form.tiktok}
          onChange={(e) => update({ tiktok: e.target.value })}
          placeholder="@tuusuario o URL"
        />
      </FormField>
      <FormField
        id="wizard-followers"
        label="Alcance estimado"
        hint="Seguidores totales en todas tus redes"
      >
        <WizardInput
          id="wizard-followers"
          value={form.socialMetrics.totalFollowers}
          onChange={(e) => updateMetrics({ totalFollowers: e.target.value })}
          placeholder="24.500"
          inputMode="numeric"
        />
      </FormField>
      <FormField id="wizard-engagement" label="% Engagement aprox.">
        <WizardInput
          id="wizard-engagement"
          value={form.socialMetrics.engagementPercent}
          onChange={(e) => updateMetrics({ engagementPercent: e.target.value })}
          placeholder="4.2%"
        />
      </FormField>
    </div>
  ) : (
    <div className="space-y-6">
      <ProfileField label="Instagram">
        {renderInput({
          value: form.instagram,
          onChange: (e) => update({ instagram: e.target.value }),
          placeholder: '@tuusuario o URL',
        })}
      </ProfileField>
      <ProfileField label="TikTok">
        {renderInput({
          value: form.tiktok,
          onChange: (e) => update({ tiktok: e.target.value }),
          placeholder: '@tuusuario o URL',
        })}
      </ProfileField>
      <ProfileField label="Alcance estimado (seguidores totales)">
        {renderInput({
          className: 'max-w-xs',
          value: form.socialMetrics.totalFollowers,
          onChange: (e) => updateMetrics({ totalFollowers: e.target.value }),
          placeholder: '24500',
          inputMode: 'numeric',
        })}
      </ProfileField>
      <ProfileField label="% Engagement aprox.">
        {renderInput({
          className: 'max-w-xs',
          value: form.socialMetrics.engagementPercent,
          onChange: (e) => updateMetrics({ engagementPercent: e.target.value }),
          placeholder: '4.2%',
        })}
      </ProfileField>
    </div>
  )

  const stepThreeFields = compact ? (
    <OnboardingCollabBrief
      item={form.successStories[0]}
      onChange={(patch) =>
        update({
          successStories: [{ ...form.successStories[0], ...patch }],
        })
      }
    />
  ) : (
    <ProfileEditCollaborations
      items={form.successStories}
      onChange={(successStories) => update({ successStories })}
      showBrands
    />
  )

  const stepDescriptions = {
    1: 'Completá lo indispensable para que las marcas te encuentren y contacten.',
    2: 'Sumá tus canales y métricas si las tenés — podés editarlo después.',
    3: 'Contá colaboraciones pasadas o dejalo vacío y finalizá.',
  }

  const footerActions = (
    <>
      <div className="flex items-center gap-2">
        {step > 1 ? (
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            ← Volver
          </Button>
        ) : (
          <span />
        )}
        {isEdit && onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        {!mandatory && !isEdit && onSkip && (
          <Button type="button" variant="ghost" size="sm" onClick={handleSkipAll}>
            Salir del wizard
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showStepSkip && (
          <Button type="button" variant="ghost" size="sm" onClick={handleSkipStep}>
            Omitir paso
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button type="button" size={compact ? 'lg' : 'event'} disabled={busy} onClick={handleNext}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Siguiente paso'}
          </Button>
        ) : (
          <Button type="submit" size={compact ? 'lg' : 'event'} disabled={busy}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mandatory ? (
              'Finalizar y entrar a Uanabi'
            ) : isEdit ? (
              'Guardar cambios'
            ) : (
              'Guardar y publicar perfil'
            )}
          </Button>
        )}
      </div>
    </>
  )

  const footer = (
    <div
      className={`flex shrink-0 flex-wrap items-center justify-between gap-3 ${
        compact ? '' : 'border-t border-border-subtle pt-8'
      }`}
    >
      {footerActions}
    </div>
  )

  if (compact) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col px-5 py-5 sm:px-8 sm:py-6">
          <div className="shrink-0 text-center">
            <Badge variant="secondary" className="mb-3">
              Registro de Host
            </Badge>
            <ProgressBar step={step} mandatory={mandatory} compact />
          </div>

          <form
            onSubmit={step === TOTAL_STEPS ? handlePublish : (e) => e.preventDefault()}
            className="mt-5 flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch lg:gap-6"
          >
            <Card className="flex min-h-0 min-w-0 flex-1 flex-col border-border-subtle shadow-sm">
              <CardHeader className="border-b border-border-subtle">
                <CardTitle className="font-display text-xl font-black tracking-tight sm:text-2xl">
                  {stepTitles[step]}
                </CardTitle>
                <CardDescription>{stepDescriptions[step]}</CardDescription>
              </CardHeader>

              <CardContent key={step} className="min-h-0 flex-1 pt-5">
                {step === 1 && stepOneFields}
                {step === 2 && stepTwoFields}
                {step === 3 && stepThreeFields}
              </CardContent>

              <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-muted/30">
                {footerActions}
              </CardFooter>
            </Card>

            <aside className="hidden w-56 shrink-0 lg:block">
              <ProfileWizardTip compact>{STEP_TIPS[step][tipKey]}</ProfileWizardTip>
            </aside>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white pb-16">
      <div className="mx-auto max-w-5xl px-8 pt-12">
        <form onSubmit={step === TOTAL_STEPS ? handlePublish : (e) => e.preventDefault()}>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <ProgressBar step={step} mandatory={mandatory} compact={false} />
            </div>

            <div className="space-y-8 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                {step > 1 ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
                    ← Volver
                  </Button>
                ) : (
                  <span />
                )}
                {showStepSkip && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleSkipStep}>
                    [ Omitir paso ]
                  </Button>
                )}
              </div>

              <div key={step} className="space-y-8">
                <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  {stepTitles[step]}
                </h1>

                {step === 1 && stepOneFields}
                {step === 2 && stepTwoFields}
                {step === 3 && stepThreeFields}
              </div>

              {footer}
            </div>

            <div className="lg:col-span-1">
              <ProfileWizardTip>{STEP_TIPS[step][tipKey]}</ProfileWizardTip>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
