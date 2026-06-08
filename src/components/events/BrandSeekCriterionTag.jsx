import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Pill de criterio — mismo lenguaje que el perfil de marca, sin títulos. */
export default function BrandSeekCriterionTag({ label, matched = false, className }) {
  return (
    <li
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 type-small font-semibold',
        matched
          ? 'border-neutral-300 bg-card text-foreground'
          : 'border-border-subtle bg-secondary/40 text-muted-foreground/70',
        className,
      )}
    >
      {matched && (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-emerald-600"
          strokeWidth={2.5}
          aria-hidden
        />
      )}
      <span>{label}</span>
    </li>
  )
}
