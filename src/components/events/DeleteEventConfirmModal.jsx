import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { countEventInvites } from '../../utils/eventSponsorMatch'

export default function DeleteEventConfirmModal({
  isOpen,
  event,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !event) return null

  const { matches, activeInvites } = countEventInvites(event)
  const totalConnections = matches + activeInvites + (event.invitedBrands?.length ?? 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-event-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 id="delete-event-title" className="type-heading font-display font-bold text-foreground">
                ¿Eliminar este evento?
              </h2>
              <p className="type-small mt-1 text-muted-foreground">{event.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="type-body mt-4 text-muted-foreground">
          Vas a perder el historial de patrocinio de este evento
          {totalConnections > 0
            ? `: invitaciones, matches y conversaciones vinculadas (${totalConnections} conexión${totalConnections !== 1 ? 'es' : ''}).`
            : '.'}{' '}
          Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" size="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="default"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => onConfirm(event.id)}
          >
            Eliminar evento
          </Button>
        </div>
      </div>
    </div>
  )
}
