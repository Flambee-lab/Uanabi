import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BRAND_INPUT_CLASS } from './BrandPanelShell'

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

function DeclineModalBody({ invitation, brandProfile, onClose, onConfirm, confirming }) {
  const [selectedId, setSelectedId] = useState(null)
  const [message, setMessage] = useState('')

  const templates = TEMPLATE_OPTIONS.map((opt) => ({
    ...opt,
    text: brandProfile?.[opt.field] ?? '',
  }))

  const selectTemplate = (tpl) => {
    setSelectedId(tpl.id)
    setMessage(tpl.text)
  }

  return (
    <div className="animate-modal-enter flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-4">
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <div className="space-y-2">
          {templates.map((tpl) => {
            const selected = selectedId === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                disabled={confirming || !tpl.text.trim()}
                onClick={() => selectTemplate(tpl)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition',
                  selected
                    ? 'border-orange-300 bg-orange-50/70 ring-1 ring-orange-400/20'
                    : 'border-slate-200 hover:border-orange-200 hover:bg-orange-50/40',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <span className="text-xs font-bold text-slate-800">{tpl.label}</span>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
                    selected
                      ? 'border-orange-400 bg-orange-400 text-white'
                      : 'border-slate-300 bg-white text-transparent',
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </button>
            )
          })}
        </div>

        {selectedId && (
          <div>
            <label htmlFor="decline-message" className="mb-1.5 block text-xs font-bold text-slate-800">
              Mensaje que recibirá el host{' '}
              <span className="font-normal text-slate-400">(podés ajustarlo)</span>
            </label>
            <textarea
              id="decline-message"
              className={`${BRAND_INPUT_CLASS} min-h-[130px] resize-y`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={confirming}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-slate-100 px-4 py-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          disabled={confirming}
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="flex-1 rounded-full bg-orange-500 font-bold text-white hover:bg-orange-400"
          disabled={confirming || !message.trim()}
          onClick={() => onConfirm?.(invitation, message.trim())}
        >
          {confirming ? 'Enviando…' : 'Enviar respuesta'}
        </Button>
      </div>
    </div>
  )
}

export default function DeclineTemplateModal({
  isOpen,
  invitation,
  brandProfile,
  onClose,
  onConfirm,
  confirming = false,
}) {
  if (!isOpen || !invitation) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-modal-title"
    >
      <DeclineModalBody
        key={invitation.id}
        invitation={invitation}
        brandProfile={brandProfile}
        onClose={onClose}
        onConfirm={onConfirm}
        confirming={confirming}
      />
    </div>
  )
}

export { TEMPLATE_OPTIONS }
