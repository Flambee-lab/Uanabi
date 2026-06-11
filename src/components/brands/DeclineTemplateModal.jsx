import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TEMPLATE_OPTIONS = [
  {
    id: 'stock',
    label: 'Agenda completa / sin stock',
    field: 'templateStock',
  },
  {
    id: 'audiencia',
    label: 'Audiencia insuficiente',
    field: 'templateAudiencia',
  },
  {
    id: 'nicho',
    label: 'Incompatibilidad de nicho',
    field: 'templateNicho',
  },
]

export default function DeclineTemplateModal({
  isOpen,
  invitation,
  brandProfile,
  onClose,
  onConfirm,
  confirming = false,
}) {
  if (!isOpen || !invitation) return null

  const templates = TEMPLATE_OPTIONS.map((opt) => ({
    ...opt,
    text: brandProfile?.[opt.field] ?? '',
  }))

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-modal-title"
    >
      <div className="animate-modal-enter w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
              Declinar propuesta
            </p>
            <h2 id="decline-modal-title" className="mt-1 font-display text-lg font-black text-slate-900">
              Elegí un mensaje amigable
            </h2>
            <p className="mt-1 text-sm text-slate-500 line-clamp-1">{invitation.eventoTitulo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              disabled={confirming || !tpl.text.trim()}
              onClick={() => onConfirm?.(invitation, tpl.text)}
              className={cn(
                'w-full rounded-2xl border px-4 py-3.5 text-left transition',
                'border-slate-200 hover:border-orange-200 hover:bg-orange-50/50',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <p className="text-xs font-bold text-slate-800">{tpl.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-4">{tpl.text}</p>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <Button type="button" variant="outline" className="w-full rounded-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

export { TEMPLATE_OPTIONS }
