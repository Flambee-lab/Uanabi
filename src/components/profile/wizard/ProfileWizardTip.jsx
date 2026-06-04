import { Lightbulb } from 'lucide-react'

export default function ProfileWizardTip({ title = 'Consejo', children }) {
  return (
    <aside className="rounded-2xl border border-neutral-100 bg-white p-6 lg:sticky lg:top-12">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-500">
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">{title}</p>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">{children}</p>
        </div>
      </div>
    </aside>
  )
}
