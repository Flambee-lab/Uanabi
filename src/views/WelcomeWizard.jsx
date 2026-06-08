import { useState } from 'react'
import { ArrowRight, Calendar, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    tip: 'A continuación vas a armar tu perfil de Host. Es obligatorio, pero lleva solo unos minutos.',
  },
]

function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1 w-12 rounded-full transition-colors duration-300 ${
            i < step ? 'bg-primary' : 'bg-border'
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
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-6 sm:px-8">
        <ProgressBar step={step} />

        <div className="mt-8 flex min-h-0 flex-1 flex-col justify-center">
          <div className="flex shrink-0 items-center justify-between gap-4">
            <p className="text-xs font-semibold text-muted-foreground">{greeting}</p>
            <button
              type="button"
              onClick={finish}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              [ Saltar introducción ]
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {current.body}
            </p>
          </div>

          <aside className="mx-auto mt-6 max-w-md rounded-2xl border border-border-subtle bg-secondary/50 px-5 py-3 text-center">
            <p className="text-xs leading-relaxed text-muted-foreground">{current.tip}</p>
          </aside>

          <div className="mt-8 flex shrink-0 flex-wrap items-center justify-center gap-3 border-t border-border-subtle pt-6">
            <Button type="button" variant="ghost" size="sm" onClick={handleSkipStep}>
              Omitir paso
            </Button>
            <Button type="button" size="lg" onClick={handleNext}>
              {step < TOTAL_STEPS ? 'Siguiente paso' : 'Crear mi perfil'}
              <ArrowRight data-icon="inline-end" className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          <p className="mt-4 shrink-0 text-center text-[11px] text-muted-foreground">
            Paso {step} de {TOTAL_STEPS} — Nada de esto es obligatorio.
          </p>
        </div>
      </div>
    </div>
  )
}
