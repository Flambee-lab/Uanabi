import { cn } from '@/lib/utils'

const TABS = [
  { id: 'password', label: 'Ingreso con contraseña' },
  { id: 'magic', label: 'Acceso rápido con Magic Link' },
]

export default function AuthMethodTabs({ value, onChange, disabled }) {
  return (
    <div className="flex rounded-xl border border-neutral-100 bg-neutral-50 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 rounded-lg px-2 py-2.5 text-[10px] font-bold leading-tight transition disabled:opacity-50 sm:text-[11px]',
            value === tab.id
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700',
          )}
        >
          {tab.id === 'magic' ? (
            <span>
              Acceso rápido
              <span className="mt-0.5 block font-medium text-neutral-400">sin contraseña</span>
            </span>
          ) : (
            tab.label
          )}
        </button>
      ))}
    </div>
  )
}
