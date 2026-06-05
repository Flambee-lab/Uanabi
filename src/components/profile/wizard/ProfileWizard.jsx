import { useState } from 'react'
import { MapPin, MessageCircle } from 'lucide-react'
import {
  createEmptyCollaboration,
  HOST_LOCATION,
  HOST_LOCATION_HINT,
  mergeProfileForSave,
} from '../../../data/hostProfile'
import IdentityTagPills from '../IdentityTagPills'
import ProfileEditCollaborations from '../ProfileEditCollaborations'
import { ProfileField, profileInputClass } from './ProfileField'
import ProfileWizardTip from './ProfileWizardTip'

const TOTAL_STEPS = 3

const STEP_TIPS = {
  1: (
    <>
      💡 Ningún campo es obligatorio. Podés omitir este paso y completar nombre, WhatsApp o tags más
      tarde desde Profile Settings.
    </>
  ),
  2: (
    <>
      Si aún no tenés métricas finales, usá <strong>[ Omitir paso ]</strong> y completalo más tarde
      desde Profile Settings.
    </>
  ),
  3: (
    <>
      Las colaboraciones con marcas, links y fotos de evidencia son tu mejor carta de presentación
      ante nuevos sponsors.
    </>
  ),
}

function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-16 rounded-full transition-colors duration-300 ${
            i < step ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}

function initForm(profile) {
  const stories = profile.successStories ?? []
  return {
    fullName: profile.fullName ?? '',
    displayName: profile.displayName ?? '',
    tagline: profile.tagline ?? '',
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

export default function ProfileWizard({ profile, onSave, onSkip, onCancel, isEdit }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => initForm(profile))

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))
  const updateMetrics = (patch) =>
    setForm((prev) => ({
      ...prev,
      socialMetrics: { ...prev.socialMetrics, ...patch },
    }))

  const saveProfile = () => {
    const cleaned = form.successStories.filter((s) => s.title?.trim())
    onSave?.(
      mergeProfileForSave(
        profile,
        {
          ...form,
          successStories: cleaned.length > 0 ? cleaned : form.successStories,
        },
        { skipValidation: true },
      ),
    )
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const handleSkipStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    } else {
      saveProfile()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1)
    } else if (isEdit && onCancel) {
      onCancel()
    }
  }

  const handlePublish = (e) => {
    e.preventDefault()
    saveProfile()
  }

  const handleSkipAll = () => {
    onSkip?.(mergeProfileForSave(profile, form, { skipValidation: true }))
  }

  const stepTitles = {
    1: 'Contanos sobre vos',
    2: 'Tus Canales Digitales',
    3: 'Casos de Éxito / Sponsors Pasados',
  }

  const showStepSkip = step === 2 || step === 3

  return (
    <div className="min-h-full bg-white pb-16">
      <div className="mx-auto max-w-5xl px-8 pt-12">
        <ProgressBar step={step} />

        <form onSubmit={step === TOTAL_STEPS ? handlePublish : (e) => e.preventDefault()}>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground/80"
                  >
                    ← Volver
                  </button>
                ) : (
                  <span />
                )}
                {showStepSkip && (
                  <button
                    type="button"
                    onClick={handleSkipStep}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    [ Omitir paso ]
                  </button>
                )}
              </div>

              <div key={step} className="space-y-8">
                <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  {stepTitles[step]}
                </h1>

                {step === 1 && (
                  <div className="space-y-6">
                    <ProfileField label="Nombre completo">
                      <input
                        className={profileInputClass}
                        value={form.fullName}
                        onChange={(e) => update({ fullName: e.target.value })}
                        placeholder="Milena Belén Miranda"
                        autoFocus
                      />
                    </ProfileField>

                    <ProfileField label="Nombre público del Host / colectivo">
                      <input
                        className={profileInputClass}
                        value={form.displayName}
                        onChange={(e) => update({ displayName: e.target.value })}
                        placeholder="Ej: Neon Collective"
                      />
                    </ProfileField>

                    <ProfileField label="WhatsApp comercial">
                      <div className="relative">
                        <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          className={`${profileInputClass} pl-10`}
                          value={form.whatsapp}
                          onChange={(e) => update({ whatsapp: e.target.value })}
                          placeholder="11 2345 6789"
                          type="tel"
                        />
                      </div>
                    </ProfileField>

                    <ProfileField label="Ubicación">
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          className={`${profileInputClass} cursor-not-allowed bg-secondary pl-10 text-muted-foreground`}
                          value={HOST_LOCATION}
                          readOnly
                          aria-readonly
                        />
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <ProfileField label="Instagram">
                      <input
                        className={profileInputClass}
                        value={form.instagram}
                        onChange={(e) => update({ instagram: e.target.value })}
                        placeholder="@tuusuario o URL"
                      />
                    </ProfileField>
                    <ProfileField label="TikTok">
                      <input
                        className={profileInputClass}
                        value={form.tiktok}
                        onChange={(e) => update({ tiktok: e.target.value })}
                        placeholder="@tuusuario o URL"
                      />
                    </ProfileField>
                    <ProfileField label="Alcance estimado (seguidores totales)">
                      <input
                        className={`${profileInputClass} max-w-xs`}
                        value={form.socialMetrics.totalFollowers}
                        onChange={(e) => updateMetrics({ totalFollowers: e.target.value })}
                        placeholder="24500"
                        inputMode="numeric"
                      />
                    </ProfileField>
                    <ProfileField label="% Engagement aprox.">
                      <input
                        className={`${profileInputClass} max-w-xs`}
                        value={form.socialMetrics.engagementPercent}
                        onChange={(e) => updateMetrics({ engagementPercent: e.target.value })}
                        placeholder="4.2%"
                      />
                    </ProfileField>
                  </div>
                )}

                {step === 3 && (
                  <ProfileEditCollaborations
                    items={form.successStories}
                    onChange={(successStories) => update({ successStories })}
                    showBrands
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
                <div className="flex items-center gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground/80"
                    >
                      Volver
                    </button>
                  ) : (
                    isEdit &&
                    onCancel && (
                      <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        Cancelar
                      </button>
                    )
                  )}
                  {!isEdit && onSkip && (
                    <button
                      type="button"
                      onClick={handleSkipAll}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground/80"
                    >
                      Salir del wizard
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {step < TOTAL_STEPS && (
                    <button
                      type="button"
                      onClick={handleSkipStep}
                      className="text-xs font-semibold text-neutral-400 hover:text-neutral-900"
                    >
                      Omitir paso
                    </button>
                  )}
                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90"
                  >
                    Siguiente paso
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90"
                  >
                    {isEdit ? 'Guardar cambios' : 'Guardar y publicar perfil'}
                  </button>
                )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ProfileWizardTip>{STEP_TIPS[step]}</ProfileWizardTip>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
