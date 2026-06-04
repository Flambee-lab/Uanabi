import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { getProfileDisplayName, getProfileInitial } from '../../data/hostProfile'

const MENU_SECTIONS = [
  [
    { id: 'profile-settings', label: 'Profile Settings' },
    { id: 'event-manager', label: 'Event Manager' },
    { id: 'privacy', label: 'Privacy' },
  ],
  [{ id: 'logout', label: 'Log Out', danger: true }],
]

export default function NavbarUserMenu({ profile, onMenuAction }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const fullName = getProfileDisplayName(profile)
  const role = profile?.role ?? 'Host'
  const initial = getProfileInitial(profile)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleItem = (id) => {
    setOpen(false)
    onMenuAction?.(id)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition hover:bg-neutral-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
            {initial}
          </span>
        )}
        <span className="max-w-[140px] truncate text-left">
          <span className="block text-xs font-bold text-neutral-900">{fullName}</span>
          <span className="block text-[10px] font-medium text-neutral-500">{role}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-neutral-100 bg-white py-2"
        >
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sectionIndex > 0 && <div className="my-2 border-t border-neutral-100" />}
              {section.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleItem(item.id)}
                  className={`block w-full px-4 py-2.5 text-left text-xs font-medium transition hover:bg-neutral-50 ${
                    item.danger ? 'text-red-600 hover:text-red-700' : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
