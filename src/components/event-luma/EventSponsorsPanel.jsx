import { useState } from 'react'
import { Search } from 'lucide-react'
import Input from '../ui/Input'
import EventInvitedSponsorList from './EventInvitedSponsorList'
import SuggestedSponsorCard from './SuggestedSponsorCard'

const TABS = [
  { id: 'invited', label: 'En tu evento' },
  { id: 'suggested', label: 'Sugeridos' },
]

export default function EventSponsorsPanel({
  event,
  invitedSponsors,
  suggestedSponsors,
  sponsorSearch,
  onSponsorSearchChange,
  onInvite,
  onOpenChat,
}) {
  const [activeTab, setActiveTab] = useState('invited')
  const isSearching = sponsorSearch.trim().length > 0

  return (
    <section className="mt-20 border-t border-neutral-100 pt-14">
      <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900">Sponsors</h2>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        Gestioná los Uanabis de tu evento: invitaciones enviadas, matches confirmados y partners
        sugeridos para{' '}
        <span className="font-semibold text-neutral-700">{event.niche}</span>.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-full max-w-md rounded-xl bg-neutral-100 p-1 sm:w-auto">
          {TABS.map((tab) => {
            const count =
              tab.id === 'invited' ? invitedSponsors.length : suggestedSponsors.length
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all sm:flex-initial ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    isActive ? 'bg-neutral-100 text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {activeTab === 'suggested' && (
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={1.75}
            />
            <Input
              type="search"
              value={sponsorSearch}
              onChange={(e) => onSponsorSearchChange?.(e.target.value)}
              placeholder="Buscar Uanabis, rubro o zona..."
              className="rounded-full border-neutral-200 py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-neutral-900"
              aria-label="Buscar Uanabis sugeridos"
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {activeTab === 'invited' ? (
          <EventInvitedSponsorList sponsors={invitedSponsors} />
        ) : (
          <>
            <p className="mb-4 text-sm text-neutral-500">
              {isSearching ? (
                <>
                  Buscando en el catálogo Uanabi
                  {suggestedSponsors.length > 0 && (
                    <>
                      {' '}
                      ·{' '}
                      <span className="font-medium text-neutral-700">
                        {suggestedSponsors.length} resultado
                        {suggestedSponsors.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>Uanabis recomendados según el nicho y las industrias de tu evento.</>
              )}
            </p>

            {suggestedSponsors.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
                <p className="text-sm font-medium text-neutral-500">
                  {isSearching
                    ? 'Ningún Uanabi coincide con tu búsqueda'
                    : 'No hay más Uanabis sugeridos por ahora'}
                </p>
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => onSponsorSearchChange?.('')}
                    className="mt-3 text-sm font-semibold text-neutral-900 hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedSponsors.map((sponsor) => (
                  <SuggestedSponsorCard
                    key={sponsor.id}
                    brand={sponsor}
                    onInvite={(id) => {
                      onInvite?.(id)
                      setActiveTab('invited')
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
