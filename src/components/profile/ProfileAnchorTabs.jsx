import { PROFILE_EDIT_SECTIONS } from '../../data/hostProfile'

export default function ProfileAnchorTabs({ activeId, onSelect }) {
  return (
    <nav className="sticky top-0 z-10 -mx-1 border-b border-border-subtle bg-[#fafafa]/95 px-1 backdrop-blur-sm">
      <div className="flex gap-6 overflow-x-auto scrollbar-none">
        {PROFILE_EDIT_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`shrink-0 border-b-2 pb-3 pt-1 text-xs font-semibold transition ${
              activeId === section.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
