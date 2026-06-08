import { Lightbulb } from 'lucide-react'

export default function ProfileWizardTip({ title = 'Consejo', children, compact = false }) {
  return (
    <aside
      className={`rounded-2xl border border-border-subtle bg-white lg:sticky lg:top-8 ${
        compact ? 'p-4' : 'p-6 lg:sticky lg:top-12'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground ${
            compact ? 'h-8 w-8' : 'h-9 w-9'
          }`}
        >
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <p className={`font-bold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{children}</p>
        </div>
      </div>
    </aside>
  )
}
