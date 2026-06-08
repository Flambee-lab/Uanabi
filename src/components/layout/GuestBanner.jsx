import { LogIn, X } from 'lucide-react'

export default function GuestBanner({ onLogin, onDismiss }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5 sm:px-6">
      <p className="text-[11px] text-neutral-600">
        <span className="font-semibold text-neutral-800">Modo invitado</span>
        {' — '}
        Tus cambios no se sincronizan hasta que inicies sesión.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onLogin}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-neutral-800"
        >
          <LogIn className="h-3 w-3" strokeWidth={2} />
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 text-neutral-400 hover:bg-white hover:text-neutral-600"
          aria-label="Ocultar aviso"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
