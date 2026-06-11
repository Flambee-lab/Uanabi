import { Link } from 'react-router-dom'
import { Sparkles, Inbox, UserCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SLATE = '#0f172a'
const EMERALD = '#10b981'

export function BrandPanelShell({ brandName, children, activeNav = 'dashboard', onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Solicitudes', href: '/brands/dashboard', icon: Inbox },
    { id: 'settings', label: 'Perfil de marca', href: '/brands/settings', icon: UserCircle },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header
        className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6"
        style={{ backgroundColor: SLATE }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg, ${EMERALD}, #2563eb)` }}
            >
              U
            </span>
            <div>
              <p className="flex items-center gap-1.5 font-display text-base font-black tracking-tight text-white">
                UANABI Brands
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              </p>
              <p className="text-xs text-slate-400">{brandName}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-8">
        <nav className="flex shrink-0 gap-2 lg:w-52 lg:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeNav === item.id
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900',
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

export const BRAND_INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/25'

export const BRAND_SLATE = SLATE
export const BRAND_EMERALD = EMERALD
