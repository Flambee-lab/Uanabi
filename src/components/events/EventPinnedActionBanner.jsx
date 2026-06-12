import { Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function EventPinnedActionBanner({ message, className }) {
  if (!message) return null

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1.5 rounded-full border border-navbar-border bg-white px-2.5 py-1',
        className,
      )}
    >
      <Pin
        className="h-3 w-3 shrink-0 text-orange-600"
        strokeWidth={2.25}
        aria-hidden
      />
      <span className="type-small min-w-0 truncate font-semibold text-orange-700">
        {message}
      </span>
    </div>
  )
}
