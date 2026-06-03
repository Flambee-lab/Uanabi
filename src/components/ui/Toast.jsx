import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4200)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="animate-modal-enter fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[#eef0f2] bg-white px-5 py-4 shadow-xl shadow-black/8">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f4f6e9]">
        <CheckCircle2 className="h-4 w-4 text-[#1d230d]" strokeWidth={2} />
      </div>
      <p className="text-sm font-semibold text-[#111827]">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded-lg p-1 text-[#9ca3af] transition-colors hover:text-[#111827]"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
