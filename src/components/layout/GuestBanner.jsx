import { LogIn, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GuestBanner({ onLogin, onDismiss }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-secondary/60 px-4 py-2.5 sm:px-6">
      <p className="type-small text-muted-foreground">
        <span className="font-semibold text-foreground">Modo invitado</span>
        {' — '}
        Tus cambios no se sincronizan hasta que inicies sesión.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button type="button" variant="primary" size="xs" onClick={onLogin}>
          <LogIn className="h-3 w-3" strokeWidth={2} />
          Iniciar sesión
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground"
          aria-label="Ocultar aviso"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
