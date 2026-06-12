import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ProfileEditActions({ onCancel, onSave, className }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="button" variant="primary" size="sm" onClick={onSave}>
        Guardar y volver
      </Button>
    </div>
  )
}
