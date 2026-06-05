import { useState } from 'react'
import { ArrowRight, Calendar, Compass, Sparkles } from 'lucide-react'

const TOTAL_STEPS = 3

const STEPS = [
  {
    icon: Sparkles,
    title: 'Bienvenido a Uanabi',
    body: 'La plataforma para Hosts que buscan sponsors en CABA. Conectá tus eventos con marcas que encajan con tu audiencia.',
    tip: 'Podés explorar todo sin completar tu perfil. La introducción es opcional.',
  },
  {
    icon: Compass,
    title: 'Descubrí marcas',
    body: 'En Inicio vas a encontrar marcas disponibles. Enviá propuestas de patrocinio o postulá tus eventos en pocos pasos.',
    tip: 'Usá el buscador y filtros para encontrar sponsors alineados a tu nicho.',
  },
  {
    icon: Calendar,
    title: 'Gestioná tus eventos',
    body: 'En Mis Eventos organizás invitaciones, sponsors recomendados y el seguimiento post-evento desde un solo lugar.',
    tip: 'Creá tu primer evento cuando quieras — no hace falta hacerlo ahora.',
  },
]

function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-16 rounded-full transition-colors duration-300 ${
            i < step ? 'bg-neutral-900' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function WelcomeWizard({ onFinish, userName, isGuest = false }) {
  const [step, setStep] = useState(1)
  const current = STEPS[step - 1]
  const Icon = current.icon

  const finish = () => onFinish?.()

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else finish()
  }

  const handleSkipStep = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else finish()
  }

  const greeting = userName?.trim()
    ? `Hola, ${userName.split(' ')[0]}`
    : isGuest
      ? 'Hola, invitado'
      : 'Hola'

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-8 py-16">
        <ProgressBar step={step} />

        <div className="mt-14">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold text-neutral-400">{greeting}</p>
            <button
              type="button"
              onClick={finish}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-900"
            >
              [ Saltar introducción ]
            </button>
          </div>

          <div className="mt-10 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-900">
              <Icon className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <h1 className="mt-8 font-display text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              {current.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-500">{current.body}</p>
          </div>

          <aside className="mx-auto mt-10 max-w-md rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-4 text-center">
            <p className="text-xs leading-relaxed text-neutral-500">{current.tip}</p>
          </aside>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-neutral-100 pt-8">
            <button
              type="button"
              onClick={handleSkipStep}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-900"
            >
              Omitir paso
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-neutral-800"
            >
              {step < TOTAL_STEPS ? 'Siguiente paso' : 'Ir al inicio'}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] text-neutral-400">
            Paso {step} de {TOTAL_STEPS} — Nada de esto es obligatorio.
          </p>
        </div>
      </div>
    </div>
  )
}
