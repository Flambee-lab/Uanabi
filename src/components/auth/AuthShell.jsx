import { Link } from 'react-router-dom'
import { AUTH_CARD_CLASS } from './authStyles'

export default function AuthShell({ children, footer }) {
  return (
    <div className="flex min-h-full flex-col overflow-y-auto bg-[#fafafa]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <p className="mb-8 text-center font-display text-sm font-black tracking-tight text-neutral-900">
          Uanabi
        </p>
        <div className={AUTH_CARD_CLASS}>{children}</div>
        {footer}
      </div>
    </div>
  )
}

export function AuthFooterLink({ to, children }) {
  return (
    <p className="mt-6 text-center text-xs text-neutral-500">
      {children}{' '}
      <Link to={to} className="font-bold text-neutral-900 underline-offset-2 hover:underline">
        {to.includes('signup') ? 'Crear cuenta' : 'Iniciar sesión'}
      </Link>
    </p>
  )
}
