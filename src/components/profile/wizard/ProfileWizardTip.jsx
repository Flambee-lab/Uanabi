import { Lightbulb } from 'lucide-react'

export default function ProfileWizardTip({ title = 'Consejo', children }) {
  return (
    <aside className="rounded-2xl border border-border-subtle bg-white p-6 lg:sticky lg:top-12">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{children}</p>
        </div>
      </div>
    </aside>
  )
}
