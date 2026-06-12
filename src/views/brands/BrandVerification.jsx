import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BadgeCheck,
  Check,
  Clock,
  Globe,
  Handshake,
  ImagePlus,
  Inbox,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import {
  BRAND_CATEGORIES,
  BRAND_MOCK_VERIFICATION_CODE,
  DEFAULT_BRAND_PROFILE,
  corporateEmailMatchesWebsite,
  isValidCorporateEmail,
  saveStoredBrandProfile,
} from '../../data/brandProfile'
import { BRAND_INPUT_CLASS, BRAND_SLATE } from '../../components/brands/BrandPanelShell'
import { BRAND_LOGIN_EMAIL } from '../../lib/brandAuth'

const TOTAL_STEPS = 4

const PLATFORM_VALUE_PROPS = [
  {
    icon: Inbox,
    title: 'Recibí propuestas de eventos reales',
    text: 'Hosts verificados te invitan a patrocinar sus eventos con pedidos concretos.',
  },
  {
    icon: Handshake,
    title: 'Elegí qué patrocinás',
    text: 'Aceptás o declinás cada propuesta — vos tenés el control de tu inversión.',
  },
  {
    icon: MessageCircle,
    title: 'Contacto directo, sin idas y vueltas',
    text: 'Al aceptar un trato, coordinás logística por WhatsApp con el host.',
  },
]

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
              'h-2 rounded-full transition-all duration-500',
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

function UanabiBrandsMark({ size = 'md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          'flex items-center justify-center rounded-xl font-display font-black text-white',
          size === 'lg' ? 'h-12 w-12 text-lg' : 'h-9 w-9 text-sm',
        )}
        style={{ background: 'linear-gradient(135deg, #34d399, #2563eb)' }}
      >
        U
      </span>
      <span
        className={cn(
          'font-display font-black tracking-tight text-white',
          size === 'lg' ? 'text-2xl' : 'text-xl',
        )}
      >
        UANABI <span className="text-emerald-400">Brands</span>
      </span>
    </div>
  )
}

function WelcomeScreen({ onStart }) {
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-12"
      style={{ backgroundColor: BRAND_SLATE }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(16,185,129,0.3), transparent 60%), radial-gradient(ellipse 50% 45% at 85% 10%, rgba(37,99,235,0.25), transparent 55%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <UanabiBrandsMark size="lg" />
        <h1 className="mt-8 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
          Bienvenido a UANABI Brands
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          La plataforma que conecta tu marca con eventos reales en CABA. Los hosts te proponen,
          vos decidís qué patrocinar.
        </p>

        <div className="mt-10 grid w-full gap-3 text-left">
          {PLATFORM_VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          size="lg"
          className="mt-10 h-12 w-full max-w-xs rounded-full bg-emerald-500 px-8 text-base font-bold text-white hover:bg-emerald-400"
          onClick={onStart}
        >
          Empecemos
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Antes necesitamos validar tu marca — te toma 2 minutos
        </p>
      </div>
    </div>
  )
}

function HeroPanel({ step }) {
  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden p-8 xl:p-10"
      style={{ backgroundColor: BRAND_SLATE }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(37,99,235,0.2), transparent 55%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <UanabiBrandsMark />
        <p className="mt-2 text-sm text-slate-400">
          Patrocinios reales para eventos reales.
        </p>

        <div className="my-auto space-y-4 py-10">
          <h2 className="font-display text-2xl font-black tracking-tight text-white xl:text-3xl">
            Necesitamos validar tu marca
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            En UANABI los hosts solo tratan con marcas verificadas. Estos datos nos permiten
            confirmar que la marca te pertenece antes de darte de alta en la plataforma.
          </p>
          <ul className="space-y-2.5 pt-2">
            {PLATFORM_VALUE_PROPS.map(({ icon: Icon, title }) => (
              <li key={title} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {title}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <BadgeCheck className="h-4 w-4 text-emerald-400" strokeWidth={2.2} />
            Validación humana del equipo UANABI en 24–48 hs hábiles
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            {step === 1 && 'Datos oficiales para confirmar que representás a la marca.'}
            {step === 2 && 'Verificamos tu correo y guardamos un contacto directo para la validación.'}
            {step === 3 && 'El perfil que verán los hosts al recibir tus respuestas.'}
            {step === 4 && 'Revisá todo y enviá la solicitud — nosotros hacemos el resto.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function SubmittedScreen({ form, onDemoEnter }) {
  return (
    <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center px-6 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/15 text-emerald-500">
        <Send className="h-8 w-8" strokeWidth={2.2} />
      </span>
      <h2 className="mt-5 font-display text-2xl font-black tracking-tight text-slate-900">
        ¡Solicitud enviada!
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Nuestro equipo va a contactarse con vos
        {form.corporateEmail ? (
          <>
            {' '}
            a <strong className="font-semibold text-slate-800">{form.corporateEmail}</strong>
          </>
        ) : null}
        {form.contactPhone ? (
          <>
            {' '}
            o al <strong className="font-semibold text-slate-800">{form.contactPhone}</strong>
          </>
        ) : null}{' '}
        para validar que la marca te pertenece. Una vez aprobada, te damos de alta en la
        plataforma y te enviamos tu{' '}
        <strong className="font-semibold text-slate-800">usuario y contraseña</strong> al correo
        corporativo.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
          <Clock className="h-3.5 w-3.5 text-emerald-500" />
          Validación en 24–48 hs hábiles
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
          <KeyRound className="h-3.5 w-3.5 text-sky-500" />
          Alta con usuario y contraseña
        </span>
      </div>

      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={onDemoEnter}
          className="mt-8 text-xs font-semibold text-slate-400 underline-offset-2 transition hover:text-slate-600 hover:underline"
        >
          Demo: entrar al panel como marca validada
        </button>
      )}
    </div>
  )
}

export default function BrandVerification() {
  const navigate = useNavigate()
  const { session, role, brandProfile, saveBrandProfile, signInAsBrand } = useAuth()
  const logoInputRef = useRef(null)

  const [showWelcome, setShowWelcome] = useState(true)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [emailPhase, setEmailPhase] = useState('input')
  const [verificationCode, setVerificationCode] = useState('')
  const [emailError, setEmailError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    marcaNombre: brandProfile?.marcaNombre ?? '',
    razonSocial: brandProfile?.razonSocial ?? '',
    cuit: brandProfile?.cuit ?? '',
    website: brandProfile?.website ?? '',
    category: brandProfile?.category ?? 'Bebidas',
    corporateEmail: brandProfile?.corporateEmail ?? '',
    corporateEmailVerified: brandProfile?.corporateEmailVerified ?? false,
    contactName: brandProfile?.contactName ?? '',
    contactRole: brandProfile?.contactRole ?? '',
    contactPhone: brandProfile?.contactPhone ?? '',
    description: brandProfile?.description ?? '',
    logoUrl: brandProfile?.logoUrl ?? null,
    instagram: brandProfile?.instagram ?? '',
    tiktok: brandProfile?.tiktok ?? '',
    linkedin: brandProfile?.linkedin ?? '',
  })

  // Marca ya logueada con onboarding completo → directo al panel
  useEffect(() => {
    if (session && role === 'brand' && (brandProfile?.verificationSubmitted || brandProfile?.isVerified)) {
      navigate('/brands/dashboard', { replace: true })
    }
  }, [session, role, brandProfile?.verificationSubmitted, brandProfile?.isVerified, navigate])

  const emailDomainValid = useMemo(
    () =>
      isValidCorporateEmail(form.corporateEmail) &&
      corporateEmailMatchesWebsite(form.corporateEmail, form.website),
    [form.corporateEmail, form.website],
  )

  const step1Valid =
    form.marcaNombre.trim() && form.website.trim() && form.category.trim()

  const step2Valid =
    form.corporateEmailVerified && form.contactName.trim() && form.contactPhone.trim()

  const step3Valid = Boolean(form.logoUrl) && form.description.trim()

  const handleSendCode = async () => {
    setEmailError('')
    if (!isValidCorporateEmail(form.corporateEmail)) {
      setEmailError('Ingresá un correo corporativo válido.')
      return
    }
    if (!corporateEmailMatchesWebsite(form.corporateEmail, form.website)) {
      setEmailError(
        `El dominio del correo debe coincidir con tu sitio web. Ej: contacto@${form.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'tumarca.com'}`,
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

  const buildNextProfile = () => ({
    ...DEFAULT_BRAND_PROFILE,
    ...brandProfile,
    ...form,
    verificationSubmitted: true,
    verificationStatus: 'pending_review',
    isVerified: false,
  })

  const handleFinish = async () => {
    setSaving(true)
    try {
      const next = buildNextProfile()
      saveStoredBrandProfile(next)
      if (session && role === 'brand') {
        await saveBrandProfile(next)
        navigate('/brands/dashboard', { replace: true })
        return
      }
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  const handleDemoEnter = async () => {
    try {
      await signInAsBrand({ email: BRAND_LOGIN_EMAIL })
      navigate('/brands/dashboard', { replace: true })
    } catch {
      /* demo: si falla, queda en la pantalla de confirmación */
    }
  }

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1))
  }

  const goNext = () => {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const skipStep = () => {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const primaryDisabled =
    (step === 1 && !step1Valid) ||
    (step === 2 && !step2Valid) ||
    (step === 3 && !step3Valid) ||
    (step === 4 && saving)

  const handlePrimary = () => {
    if (step < TOTAL_STEPS) {
      goNext()
      return
    }
    handleFinish()
  }

  if (showWelcome && !submitted) {
    return (
      <div className="fixed inset-0 z-50">
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: BRAND_SLATE }}>
      <aside className="hidden min-h-0 w-[42%] shrink-0 lg:block xl:w-[44%]">
        <HeroPanel step={step} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-black/20">
          {submitted ? (
            <SubmittedScreen form={form} onDemoEnter={handleDemoEnter} />
          ) : (
            <>
              <div className="shrink-0 border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    Validación de marca
                  </span>
                </div>
                <h1 className="mt-2 font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {step === 1 && 'Identidad de la marca'}
                  {step === 2 && 'Verificación y contacto'}
                  {step === 3 && 'Perfil público de la marca'}
                  {step === 4 && 'Revisá y enviá tu solicitud'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {step === 1 && 'Datos oficiales para validar que representás a la marca.'}
                  {step === 2 && 'Verificá tu correo corporativo y dejanos un contacto directo.'}
                  {step === 3 && 'Así te van a ver los hosts cuando reciban tus respuestas.'}
                  {step === 4 && 'Nuestro equipo valida la información antes de darte de alta.'}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {step === 1 && (
                  <div className="mx-auto max-w-lg space-y-4">
                    <div>
                      <label htmlFor="marca-nombre" className="mb-2 block text-xs font-bold text-slate-800">
                        Nombre comercial de la marca *
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="razon-social" className="mb-2 block text-xs font-bold text-slate-800">
                          Razón social{' '}
                          <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <input
                          id="razon-social"
                          className={BRAND_INPUT_CLASS}
                          value={form.razonSocial}
                          onChange={(e) => setForm((p) => ({ ...p, razonSocial: e.target.value }))}
                          placeholder="VitalSport S.A."
                        />
                      </div>
                      <div>
                        <label htmlFor="cuit" className="mb-2 block text-xs font-bold text-slate-800">
                          CUIT <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <input
                          id="cuit"
                          className={BRAND_INPUT_CLASS}
                          value={form.cuit}
                          onChange={(e) => setForm((p) => ({ ...p, cuit: e.target.value }))}
                          placeholder="30-12345678-9"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      La razón social y el CUIT aceleran la validación: nos permiten cruzar tus
                      datos con registros públicos.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="mx-auto max-w-lg space-y-5">
                    <div>
                      <label htmlFor="corp-email" className="mb-2 block text-xs font-bold text-slate-800">
                        Correo corporativo *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
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
                              setEmailPhase('input')
                              setEmailError('')
                            }}
                            placeholder="contacto@vitalsport.com"
                          />
                        </div>
                        {emailPhase !== 'verified' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="shrink-0 rounded-xl border-slate-200 text-xs font-bold"
                            disabled={sendingCode || !emailDomainValid}
                            onClick={handleSendCode}
                          >
                            {sendingCode
                              ? 'Enviando…'
                              : emailPhase === 'code_sent'
                                ? 'Reenviar'
                                : 'Enviar código'}
                          </Button>
                        )}
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

                      {emailPhase === 'code_sent' && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <label htmlFor="verify-code" className="mb-2 block text-xs font-bold text-slate-800">
                            Ingresá el código que te enviamos (6 dígitos)
                          </label>
                          <div className="flex gap-2">
                            <input
                              id="verify-code"
                              inputMode="numeric"
                              maxLength={6}
                              className={`${BRAND_INPUT_CLASS} text-center text-base tracking-[0.35em] font-semibold`}
                              value={verificationCode}
                              onChange={(e) => {
                                setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                                setCodeError('')
                              }}
                              placeholder="••••••"
                            />
                            <Button
                              type="button"
                              className="shrink-0 rounded-xl bg-emerald-500 text-xs font-bold text-white hover:bg-emerald-400"
                              disabled={verifyingCode || verificationCode.length !== 6}
                              onClick={handleVerifyCode}
                            >
                              {verifyingCode ? 'Verificando…' : 'Verificar'}
                            </Button>
                          </div>
                          {codeError && (
                            <p className="mt-2 text-sm text-red-600" role="alert">
                              {codeError}
                            </p>
                          )}
                          {import.meta.env.DEV && (
                            <p className="mt-2 text-xs text-slate-400">
                              Demo: código {BRAND_MOCK_VERIFICATION_CODE}
                            </p>
                          )}
                        </div>
                      )}

                      {emailPhase === 'verified' && (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          Correo verificado
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-sky-200/70 bg-sky-50/60 px-4 py-3.5">
                      <p className="text-xs leading-relaxed text-sky-950/80">
                        <strong className="font-bold">¿Para qué pedimos esto?</strong> El equipo de
                        UANABI te contacta por estos medios para validar que la marca te pertenece
                        antes de darte de alta.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="mb-2 block text-xs font-bold text-slate-800">
                          Nombre del responsable *
                        </label>
                        <input
                          id="contact-name"
                          className={BRAND_INPUT_CLASS}
                          value={form.contactName}
                          onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                          placeholder="Milena Fernández"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-role" className="mb-2 block text-xs font-bold text-slate-800">
                          Cargo <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <input
                          id="contact-role"
                          className={BRAND_INPUT_CLASS}
                          value={form.contactRole}
                          onChange={(e) => setForm((p) => ({ ...p, contactRole: e.target.value }))}
                          placeholder="Brand Manager"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="mb-2 block text-xs font-bold text-slate-800">
                        Teléfono / WhatsApp de contacto *
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="contact-phone"
                          type="tel"
                          className={`${BRAND_INPUT_CLASS} pl-10`}
                          value={form.contactPhone}
                          onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                          placeholder="11 2345 6789"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
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

                    <div className="grid gap-4 sm:grid-cols-2">
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
                    <div className="flex items-center gap-4 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-600">
                        <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <p className="text-xs leading-relaxed text-slate-600">
                        Vamos a <strong className="font-semibold text-slate-800">contactarte</strong>{' '}
                        para validar que la marca te pertenece. Una vez aprobada, te damos de alta
                        con <strong className="font-semibold text-slate-800">usuario y contraseña</strong>{' '}
                        enviados a tu correo corporativo.
                      </p>
                    </div>

                    <div
                      className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg"
                      style={{ backgroundColor: BRAND_SLATE }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-5 py-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Solicitud de alta
                          </p>
                          <p className="mt-0.5 font-display text-base font-black text-white">
                            {form.marcaNombre || 'Tu marca'}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                          Verificación en revisión
                        </span>
                      </div>
                      <div className="space-y-3 bg-white p-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            Identidad
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            <SummaryRow label="Marca" value={form.marcaNombre || '—'} />
                            <SummaryRow label="Sitio web" value={form.website || '—'} />
                            <SummaryRow label="Categoría" value={form.category || '—'} />
                            {form.razonSocial && <SummaryRow label="Razón social" value={form.razonSocial} />}
                            {form.cuit && <SummaryRow label="CUIT" value={form.cuit} />}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            Contacto para la validación
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            <SummaryRow
                              label={form.corporateEmailVerified ? 'Correo verificado' : 'Correo'}
                              value={form.corporateEmail || 'Pendiente de verificación'}
                            />
                            <SummaryRow
                              label="Responsable"
                              value={
                                form.contactName
                                  ? `${form.contactName}${form.contactRole ? ` · ${form.contactRole}` : ''}`
                                  : '—'
                              }
                            />
                            <SummaryRow label="Teléfono / WhatsApp" value={form.contactPhone || '—'} />
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            Perfil público
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            <SummaryRow
                              label="Perfil"
                              value={step3Valid ? 'Completado' : 'Incompleto — podés completarlo después'}
                            />
                          </ul>
                        </div>
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
                      disabled={saving}
                      className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
                    >
                      Omitir paso
                    </button>
                  )}
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-slate-200"
                      onClick={goBack}
                      disabled={saving}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-slate-200"
                      onClick={() => setShowWelcome(true)}
                      disabled={saving}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Bienvenida
                    </Button>
                  )}

                  <Button
                    type="button"
                    className="rounded-full bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-400"
                    disabled={primaryDisabled}
                    onClick={handlePrimary}
                  >
                    {step === 4 ? (saving ? 'Enviando…' : 'Enviar solicitud') : 'Continuar'}
                    {step < TOTAL_STEPS && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
