import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteAccountModal({ isOpen, email, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen) return null

  const canDelete = confirmText.trim().toUpperCase() === 'ELIMINAR'

  const handleClose = () => {
    setConfirmText('')
    onClose?.()
  }

  const handleConfirm = () => {
    if (!canDelete) return
    onConfirm?.()
    setConfirmText('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h2
                id="delete-account-title"
                className="font-display text-lg font-bold text-foreground"
              >
                Eliminar cuenta definitivamente
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Esta acción es irreversible. Se borrarán tu perfil de Host, eventos y
                colaboraciones asociadas en Supabase.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-6 type-small text-muted-foreground">
          Cuenta: <span className="font-semibold text-foreground/80">{email}</span>
        </p>
        <p className="mt-4 text-xs font-medium text-foreground/80">
          Escribí <span className="font-bold text-red-600">ELIMINAR</span> para confirmar
        </p>
        <input
          className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-xs text-foreground focus:border-red-500 focus:bg-white focus:outline-none"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="ELIMINAR"
          autoComplete="off"
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canDelete}
            className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-bold text-white disabled:opacity-40 hover:bg-red-700"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  )
}
