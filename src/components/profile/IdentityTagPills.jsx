import { Minus, Plus } from 'lucide-react'
import { HOST_IDENTITY_TAGS } from '../../data/hostProfile'

export default function IdentityTagPills({ selected = [], onChange, compact = false }) {
  const toggle = (tag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {HOST_IDENTITY_TAGS.map((tag) => {
        const active = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold transition ${
              compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs'
            } ${
              active
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-foreground hover:border-muted-foreground/40'
            }`}
          >
            {active ? (
              <Minus className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <Plus className="h-3 w-3" strokeWidth={2.5} />
            )}
            {tag}
          </button>
        )
      })}
    </div>
  )
}
