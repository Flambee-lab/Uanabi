import {
  CalendarPlus,
  CheckCircle2,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const VISUALS = {
  welcome: {
    Icon: Sparkles,
    gradient: 'from-[#111827] via-[#1f2937] to-[#374151]',
    glow: 'bg-amber-300/20',
    caption: 'Conectamos Hosts con sponsors en Capital Federal',
    chips: ['Eventos', 'Marcas', 'Matches'],
  },
  profile: {
    Icon: UserRound,
    gradient: 'from-[#1e3a5f] via-[#2563eb] to-[#60a5fa]',
    glow: 'bg-sky-300/25',
    caption: 'Tu perfil para que las marcas te conozcan',
    chips: ['Nombre', 'Ciudad', 'Foto'],
  },
  social: {
    Icon: Share2,
    gradient: 'from-[#14532d] via-[#16a34a] to-[#4ade80]',
    glow: 'bg-emerald-300/25',
    caption: 'Pegá tus links o usuarios — sin vincular cuentas',
    chips: ['Instagram', 'TikTok', 'X'],
  },
  event: {
    Icon: CalendarPlus,
    gradient: 'from-[#4c1d95] via-[#7c3aed] to-[#c4b5fd]',
    glow: 'bg-violet-300/25',
    caption: '¿Querés publicar un evento ahora?',
    chips: ['Crear', 'Después', 'Explorar'],
  },
  complete: {
    Icon: CheckCircle2,
    gradient: 'from-[#14532d] via-[#16a34a] to-[#4ade80]',
    glow: 'bg-emerald-300/25',
    caption: 'Tu perfil está listo para la plataforma',
    chips: ['Listo', 'Perfil', 'Panel'],
  },
}

function FloatingChip({ children, className }) {
  return (
    <span
      className={cn(
        'rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default function HostRegistrationIllustration({
  stepId,
  className,
  compact = false,
  hero = false,
  greeting,
  imageSrc,
  heroActions,
}) {
  const visual = VISUALS[stepId] ?? VISUALS.welcome
  const Icon = visual.Icon

  if (hero) {
    return (
      <div
        className={cn(
          'relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br',
          visual.gradient,
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="flex w-full max-w-2xl flex-col items-center">
            <p className="font-display text-sm font-bold tracking-wide text-white/60">Uanabi</p>

            <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {greeting ? `¡Hola, ${greeting}!` : '¡Hola!'}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85 sm:text-xl">
              Somos la plataforma para <strong className="font-semibold text-white">Hosts</strong>{' '}
              que buscan sponsors en CABA.
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
              En unos minutos armamos tu perfil para que las marcas te encuentren, te contacten por
              WhatsApp y propongan patrocinios para tus eventos.
            </p>

            <div className="relative my-10 sm:my-12">
              <div className="relative">
                <div className={cn('absolute -inset-12 rounded-full blur-3xl', visual.glow)} />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md sm:h-40 sm:w-40">
                  <Icon className="h-14 w-14 text-white sm:h-16 sm:w-16" strokeWidth={1.25} />
                </div>
                <FloatingChip className="absolute -top-2 -right-10">{visual.chips[0]}</FloatingChip>
                <FloatingChip className="absolute -bottom-2 -left-10">{visual.chips[1]}</FloatingChip>
                <FloatingChip className="absolute top-1/2 -right-14 -translate-y-1/2">
                  {visual.chips[2]}
                </FloatingChip>
              </div>
            </div>

            <p className="max-w-sm text-sm text-white/50">{visual.caption}</p>

            {heroActions && <div className="mt-10 w-full max-w-sm">{heroActions}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      key={stepId}
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br transition-colors duration-500',
        visual.gradient,
        compact ? 'p-5' : 'p-8 xl:p-12',
        className,
      )}
    >
      <div className={cn('relative z-10', compact && 'hidden sm:block')}>
        <p className="font-display text-sm font-bold tracking-wide text-white/70">Uanabi</p>
        {!compact && (
          <p className="mt-6 max-w-xs text-2xl leading-tight font-black tracking-tight text-white xl:text-3xl">
            {visual.caption}
          </p>
        )}
      </div>

      <div
        className={cn(
          'relative z-10 flex flex-1 items-center justify-center',
          compact ? 'py-2' : 'mt-auto py-8',
        )}
      >
        <div className="relative">
          <div className={cn('absolute -inset-10 rounded-full blur-3xl', visual.glow)} />
          <div
            className={cn(
              'relative flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md',
              compact ? 'h-24 w-24' : 'h-40 w-40 xl:h-48 xl:w-48',
            )}
          >
            {imageSrc ? (
              <img src={imageSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <Icon
                className={cn('text-white', compact ? 'h-10 w-10' : 'h-16 w-16 xl:h-20 xl:w-20')}
                strokeWidth={1.25}
              />
            )}
          </div>

          {!compact && (
            <>
              <FloatingChip className="absolute -top-3 -right-8">{visual.chips[0]}</FloatingChip>
              <FloatingChip className="absolute -bottom-2 -left-10">{visual.chips[1]}</FloatingChip>
              <FloatingChip className="absolute top-1/2 -right-14 -translate-y-1/2">
                {visual.chips[2]}
              </FloatingChip>
            </>
          )}
        </div>
      </div>

      {!compact && <p className="relative z-10 type-small text-white/50">{visual.caption}</p>}
    </div>
  )
}
