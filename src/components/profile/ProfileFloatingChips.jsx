import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

function FloatingChip({ children, className, tone = 'light' }) {
  return (
    <span
      className={cn(
        'absolute z-10 max-w-[9rem] truncate rounded-full px-3.5 py-2 text-[11px] font-bold shadow-lg backdrop-blur-md',
        tone === 'dark'
          ? 'border border-neutral-800/10 bg-neutral-900 text-white'
          : 'border border-white/70 bg-white/95 text-neutral-800',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default function ProfileFloatingChips({ categories = [], eventsCount = 0 }) {
  const tagA = categories[0]
  const eventsLabel = eventsCount === 1 ? '1 evento' : `${eventsCount} eventos`

  const chips = [
    tagA && {
      label: tagA,
      className: '-right-2 -top-3 sm:-right-5',
      tone: 'light',
    },
    {
      label: (
        <span className="inline-flex items-center gap-1">
          <BadgeCheck className="h-3 w-3 shrink-0" strokeWidth={2.5} />
          Verificado
        </span>
      ),
      className: '-left-3 top-[38%] sm:-left-6',
      tone: 'dark',
    },
    eventsCount > 0 && {
      label: eventsLabel,
      className: '-bottom-3 left-1/2 -translate-x-1/2 sm:-bottom-4',
      tone: 'light',
    },
  ].filter(Boolean)

  if (chips.length === 0) return null

  return (
    <>
      {chips.slice(0, 3).map((chip, i) => (
        <FloatingChip key={i} className={chip.className} tone={chip.tone}>
          {chip.label}
        </FloatingChip>
      ))}
    </>
  )
}
