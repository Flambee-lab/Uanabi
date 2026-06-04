import { Plus } from 'lucide-react'
import { countEventInvites } from '../../utils/eventSponsorMatch'

export default function EventPickerRail({ events, selectedId, onSelect, onCreateEvent }) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-r border-neutral-100 bg-white">
      <div className="shrink-0 border-b border-neutral-100 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Tus eventos
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-2">
        {events.map((event) => {
          const { matches, activeInvites } = countEventInvites(event)
          const isActive = event.id === selectedId

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              className={`w-full rounded-xl px-3 py-2 text-left transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <p
                className={`line-clamp-2 text-xs font-bold leading-snug ${
                  isActive ? 'text-white' : 'text-neutral-900'
                }`}
              >
                {event.title}
              </p>
              <p
                className={`mt-1 text-[10px] ${
                  isActive ? 'text-neutral-300' : 'text-neutral-400'
                }`}
              >
                {event.date}
              </p>
              {(matches > 0 || activeInvites > 0) && (
                <p
                  className={`mt-1 text-[9px] font-medium ${
                    isActive ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {matches > 0 && `${matches} match`}
                  {matches > 0 && activeInvites > 0 && ' · '}
                  {activeInvites > 0 && `${activeInvites} invit.`}
                </p>
              )}
            </button>
          )
        })}
        {events.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-neutral-400">Sin eventos</p>
        )}
      </div>

      <div className="shrink-0 border-t border-neutral-100 p-3">
        <button
          type="button"
          onClick={onCreateEvent}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </button>
      </div>
    </aside>
  )
}
