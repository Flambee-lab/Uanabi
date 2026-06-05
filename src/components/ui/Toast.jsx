import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4200)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="animate-modal-enter fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border-subtle bg-white px-5 py-4 shadow-xl shadow-black/8">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-match">
        <CheckCircle2 className="h-4 w-4 text-match-foreground" strokeWidth={2} />
      </div>
      <p className="text-sm font-semibold text-foreground">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
