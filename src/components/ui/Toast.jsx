import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Toast({ message, title, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, title ? 5500 : 4200)
    return () => clearTimeout(timer)
  }, [onClose, title])

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-enter fixed top-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3.5 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 shadow-2xl shadow-black/40 ring-1 ring-white/5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400 shadow-lg shadow-sky-400/25">
        <CheckCircle2 className="h-5 w-5 text-slate-900" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        {title ? (
          <>
            <p className="font-display text-base font-black tracking-tight text-white">{title}</p>
            <p className="mt-1 text-sm leading-snug text-slate-300">{message}</p>
          </>
        ) : (
          <p className="text-sm font-semibold leading-snug text-white">{message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors',
          'hover:bg-white/10 hover:text-white',
        )}
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}
