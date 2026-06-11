import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  Globe,
  ImagePlus,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import {
  BRAND_CATEGORIES,
  BRAND_MOCK_VERIFICATION_CODE,
  corporateEmailMatchesWebsite,
  isValidCorporateEmail,
} from '../../data/brandProfile'
import {
  BRAND_EMERALD,
  BRAND_INPUT_CLASS,
  BRAND_SLATE,
} from '../../components/brands/BrandPanelShell'

const TOTAL_STEPS = 4

function StepDots({ current }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">
        Paso {current} de {TOTAL_STEPS}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 rounded-full transition-all',
              i + 1 === current ? 'w-6 bg-emerald-400' : i + 1 < current ? 'w-2 bg-emerald-400/50' : 'w-2 bg-slate-200',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-800">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
      <span>
        <span className="text-slate-500">{label}: </span>
        <strong className="font-semibold">{value}</strong>
      </span>
    </li>
  )
}

function HeroPanel({ step, brandName }) {
  const copy = {
    1: 'Confirmá que representás oficialmente a la marca con datos públicos verificables.',
    2: 'Validamos que tu correo pertenezca al dominio oficial del sitio web.',
    3: 'Completá el perfil público que verán los hosts al recibir propuestas.',
    4: 'Revisá el resumen antes de enviar la solicitud al equipo UANABI.',
  }

  const icons = [ShieldCheck, Mail, UserCircle, Check]

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden p-8 xl:p-10"
      style={{ backgroundColor: BRAND_SLATE }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 20% 80%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 20%, rgba(37,99,235,0.25), transparent 55%)',
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/90">
            Validación de marca
          </span>
        </div>
        <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white xl:text-4xl">
          {brandName || 'Tu marca'}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">{copy[step]}</p>
        <div className="mt-auto flex items-end gap-3 pt-12">
          {icons.map((Icon, i) => (
            <div
              key={Icon.name}
              className={cn(
                'rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm',
                i + 1 === step && 'scale-105 border-emerald-400/30',
              )}
            >
              <Icon className="h-8 w-8 text-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BrandVerification() {
  const navigate = useNavigate()
  const { brandProfile, saveBrandProfile } = useAuth()
  const logoInputRef = useRef(null)

  const [step, setStep] = useState(1)
  const [emailPhase, setEmailPhase] = useState('input')
  const [verificationCode, setVerificationCode] = useState('')
  const [emailError, setEmailError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    marcaNombre: brandProfile?.marcaNombre ?? '',
    website: brandProfile?.website ?? '',
    category: brandProfile?.category ?? 'Bebidas',
    corporateEmail: brandProfile?.corporateEmail ?? '',
    corporateEmailVerified: brandProfile?.corporateEmailVerified ?? false,
    description: brandProfile?.description ?? '',
    logoUrl: brandProfile?.logoUrl ?? null,
    instagram: brandProfile?.instagram ?? '',
    tiktok: brandProfile?.tiktok ?? '',
    linkedin: brandProfile?.linkedin ?? '',
  })

  useEffect(() => {
    if (brandProfile?.verificationSubmitted || brandProfile?.isVerified) {
      navigate('/brands/dashboard', { replace: true })
    }
  }, [brandProfile?.verificationSubmitted, brandProfile?.isVerified, navigate])

  const emailDomainValid = useMemo(
    () =>
      isValidCorporateEmail(form.corporateEmail) &&
      corporateEmailMatchesWebsite(form.corporateEmail, form.website),
    [form.corporateEmail, form.website],
  )

  const step1Valid =
    form.marcaNombre.trim() && form.website.trim() && form.category.trim()

  const step2Valid = form.corporateEmailVerified

  const step3Valid = Boolean(form.logoUrl) && form.description.trim()

  const handleSendCode = async () => {
    setEmailError('')
    if (!isValidCorporateEmail(form.corporateEmail)) {
      setEmailError('Ingresá un correo corporativo válido.')
      return
    }
    if (!corporateEmailMatchesWebsite(form.corporateEmail, form.website)) {
      setEmailError(
        `El dominio del correo debe coincidir con el sitio web (${form.website}). Ej: contacto@${form.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}`,
      )
      return
    }
    setSendingCode(true)
    await new Promise((r) => setTimeout(r, 600))
    setSendingCode(false)
    setEmailPhase('code_sent')
    setVerificationCode('')
    setCodeError('')
  }

  const handleVerifyCode = async () => {
    setCodeError('')
    if (verificationCode.trim().length !== 6) {
      setCodeError('El código debe tener 6 dígitos.')
      return
    }
    setVerifyingCode(true)
    await new Promise((r) => setTimeout(r, 500))
    setVerifyingCode(false)

    if (verificationCode.trim() !== BRAND_MOCK_VERIFICATION_CODE) {
      setCodeError('Código incorrecto. En demo usá 123456.')
      return
    }

    setForm((p) => ({ ...p, corporateEmailVerified: true }))
    setEmailPhase('verified')
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((p) => ({ ...p, logoUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await saveBrandProfile({
        ...brandProfile,
        ...form,
        verificationSubmitted: true,
        verificationStatus: 'pending_review',
        isVerified: false,
      })
      navigate('/brands/dashboard', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  const goBack = () => {
    if (step === 2 && emailPhase !== 'input') {
      setEmailPhase('input')
      setVerificationCode('')
      setCodeError('')
      return
    }
    setStep((s) => Math.max(1, s - 1))
  }

  const goNext = () => {
    if (step === 2 && !step2Valid) return
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const skipStep = () => {
    if (step === 2) {
      setEmailPhase('input')
      setVerificationCode('')
      setEmailError('')
      setCodeError('')
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const primaryDisabled =
    (step === 1 && !step1Valid) ||
    (step === 2 && !step2Valid) ||
    (step === 3 && !step3Valid) ||
    (step === 4 && saving)

  const primaryLabel = {
    1: 'Continuar',
    2: emailPhase === 'input' ? 'Enviar código' : emailPhase === 'code_sent' ? 'Verificar' : 'Continuar',
    3: 'Continuar',
    4: saving ? 'Enviando…' : 'Finalizar',
  }

  const handlePrimary = () => {
    if (step === 1) {
      goNext()
      return
    }
    if (step === 2) {
      if (emailPhase === 'input') {
        handleSendCode()
        return
      }
      if (emailPhase === 'code_sent') {
        handleVerifyCode()
        return
      }
      goNext()
      return
    }
    if (step === 3) {
      goNext()
      return
    }
    handleFinish()
  }

  const showPrimaryContinueOnStep2 = step === 2 && emailPhase === 'verified'

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: BRAND_SLATE }}>
      <aside className="hidden min-h-0 w-[42%] shrink-0 lg:block">
        <HeroPanel step={step} brandName={form.marcaNombre} />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl">
          <div className="shrink-0 border-b border-slate-100 px-6 py-5 sm:px-8">
            <h1 className="font-display text-xl font-black text-slate-900 sm:text-2xl">
              {step === 1 && 'Información de la marca'}
              {step === 2 && (emailPhase === 'code_sent' ? 'Código enviado' : 'Verifica tu correo corporativo')}
              {step === 3 && 'Perfil público de la marca'}
              {step === 4 && 'Resumen de verificación'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {step === 1 && 'Ayudanos a validar que representás oficialmente a una marca.'}
              {step === 2 &&
                (emailPhase === 'code_sent'
                  ? `Te enviamos un código de verificación a ${form.corporateEmail}.`
                  : 'Utilizá un correo asociado al dominio oficial de tu marca.')}
              {step === 3 && 'Completá cómo se verá tu marca ante los hosts.'}
              {step === 4 && 'Revisá los datos antes de enviar la solicitud.'}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            {step === 1 && (
              <div className="mx-auto max-w-lg space-y-4">
                <div>
                  <label htmlFor="marca-nombre" className="mb-2 block text-xs font-bold text-slate-800">
                    Nombre de la marca *
                  </label>
                  <input
                    id="marca-nombre"
                    className={BRAND_INPUT_CLASS}
                    value={form.marcaNombre}
                    onChange={(e) => setForm((p) => ({ ...p, marcaNombre: e.target.value }))}
                    placeholder="VitalSport"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="mb-2 block text-xs font-bold text-slate-800">
                    Sitio web oficial *
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="website"
                      type="url"
                      className={`${BRAND_INPUT_CLASS} pl-10`}
                      value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://vitalsport.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="mb-2 block text-xs font-bold text-slate-800">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    className={BRAND_INPUT_CLASS}
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {BRAND_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mx-auto max-w-lg space-y-4">
                {(emailPhase === 'input' || emailPhase === 'code_sent') && (
                  <div>
                    <label htmlFor="corp-email" className="mb-2 block text-xs font-bold text-slate-800">
                      Correo corporativo *
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="corp-email"
                        type="email"
                        className={`${BRAND_INPUT_CLASS} pl-10`}
                        value={form.corporateEmail}
                        onChange={(e) => {
                          setForm((p) => ({
                            ...p,
                            corporateEmail: e.target.value,
                            corporateEmailVerified: false,
                          }))
                          setEmailError('')
                        }}
                        disabled={emailPhase === 'code_sent'}
                        placeholder="contacto@vitalsport.com"
                      />
                    </div>
                    {emailError && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {emailError}
                      </p>
                    )}
                    {emailPhase === 'input' && form.corporateEmail && !emailDomainValid && (
                      <p className="mt-2 text-xs text-amber-700">
                        El dominio debe coincidir con tu sitio web. Ej: si el sitio es{' '}
                        <strong>vitalsport.com</strong>, el mail debe ser{' '}
                        <strong>@vitalsport.com</strong>.
                      </p>
                    )}
                  </div>
                )}

                {emailPhase === 'code_sent' && (
                  <div>
                    <label htmlFor="verify-code" className="mb-2 block text-xs font-bold text-slate-800">
                      Código de verificación (6 dígitos)
                    </label>
                    <input
                      id="verify-code"
                      inputMode="numeric"
                      maxLength={6}
                      className={`${BRAND_INPUT_CLASS} text-center text-lg tracking-[0.35em] font-semibold`}
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        setCodeError('')
                      }}
                      placeholder="••••••"
                    />
                    {codeError && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {codeError}
                      </p>
                    )}
                    {import.meta.env.DEV && (
                      <p className="mt-2 text-xs text-slate-400">Demo: código {BRAND_MOCK_VERIFICATION_CODE}</p>
                    )}
                  </div>
                )}

                {emailPhase === 'verified' && (
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      <Check className="h-4 w-4" />
                      Correo corporativo verificado
                    </p>
                    <p className="mt-1 text-sm text-emerald-900/80">{form.corporateEmail}</p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-lg space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold text-slate-800">Logo de la marca *</p>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30"
                  >
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt=""
                        className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <ImagePlus className="h-6 w-6 text-slate-400" />
                      </span>
                    )}
                    <span className="text-sm text-slate-600">
                      {form.logoUrl ? 'Cambiar logo' : 'Subir logo (PNG, JPG)'}
                    </span>
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleLogoChange}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-xs font-bold text-slate-800">
                    Descripción corta *
                  </label>
                  <textarea
                    id="description"
                    className={`${BRAND_INPUT_CLASS} min-h-[96px] resize-y`}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Bebidas energéticas e isotónicas para eventos deportivos y culturales."
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="mb-2 block text-xs font-bold text-slate-800">
                    Instagram
                  </label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="instagram"
                      className={`${BRAND_INPUT_CLASS} pl-10`}
                      value={form.instagram}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, instagram: e.target.value.replace('@', '') }))
                      }
                      placeholder="vitalsport.ar"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tiktok" className="mb-2 block text-xs font-bold text-slate-800">
                    TikTok
                  </label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="tiktok"
                      className={`${BRAND_INPUT_CLASS} pl-10`}
                      value={form.tiktok}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, tiktok: e.target.value.replace('@', '') }))
                      }
                      placeholder="vitalsport"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="linkedin" className="mb-2 block text-xs font-bold text-slate-800">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    className={BRAND_INPUT_CLASS}
                    value={form.linkedin}
                    onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                    placeholder="vitalsport"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="mx-auto max-w-lg space-y-4">
                <div
                  className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg"
                  style={{ backgroundColor: BRAND_SLATE }}
                >
                  <div className="border-b border-white/10 px-6 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Resumen del trato
                    </p>
                    <p className="mt-2 font-display text-xl font-black text-white">{form.marcaNombre}</p>
                    <span className="mt-3 inline-flex rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                      Verificación en revisión
                    </span>
                  </div>
                  <div className="space-y-3 bg-white p-5">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        Datos enviados
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        <SummaryRow label="Nombre de la marca" value={form.marcaNombre || '—'} />
                        <SummaryRow label="Sitio web" value={form.website || '—'} />
                        <SummaryRow
                          label={
                            form.corporateEmailVerified
                              ? 'Correo corporativo verificado'
                              : 'Correo corporativo'
                          }
                          value={
                            form.corporateEmail ||
                            (form.corporateEmailVerified ? '—' : 'Pendiente de verificación')
                          }
                        />
                        <SummaryRow
                          label="Perfil"
                          value={step3Valid ? 'Completado' : 'Incompleto — podés completarlo después'}
                        />
                      </ul>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      Nuestro equipo revisará la información enviada. Una vez aprobada, tu marca
                      recibirá el estado de <strong>Marca Verificada</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 sm:px-8">
            <StepDots current={step} />
            <div className="flex items-center gap-2">
              {step < TOTAL_STEPS && (
                <button
                  type="button"
                  onClick={skipStep}
                  disabled={saving || sendingCode || verifyingCode}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
                >
                  Omitir paso
                </button>
              )}
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={goBack}
                  disabled={saving || sendingCode || verifyingCode}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              ) : null}

              {!(step === 2 && emailPhase === 'verified') ? (
                <Button
                  type="button"
                  className="rounded-full bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-400"
                  disabled={
                    primaryDisabled ||
                    sendingCode ||
                    verifyingCode ||
                    (step === 2 && emailPhase === 'input' && !emailDomainValid) ||
                    (step === 2 && emailPhase === 'code_sent' && verificationCode.length !== 6)
                  }
                  onClick={handlePrimary}
                >
                  {sendingCode
                    ? 'Enviando…'
                    : verifyingCode
                      ? 'Verificando…'
                      : primaryLabel[step]}
                  {step === 1 && !sendingCode && !verifyingCode && <ArrowRight className="h-4 w-4" />}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-full bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-400"
                  onClick={goNext}
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {showPrimaryContinueOnStep2 && null}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
