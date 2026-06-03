import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import AdmissionRulesModal from '../components/matches/AdmissionRulesModal'
import InboundProposalCard from '../components/matches/InboundProposalCard'
import OutboundApplicationCard from '../components/matches/OutboundApplicationCard'
import { DEFAULT_ADMISSION_RULES, myApplications, receivedProposals } from '../data/mockEvents'
import { countHiddenByRules, filterByAdmissionRules } from '../utils/gatekeeperFilters'

function TabButton({ active, onClick, label, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 pb-1 transition-colors ${
        active ? 'text-[#111827]' : 'text-[#9ca3af] hover:text-[#6b7280]'
      }`}
    >
      <span
        className={`font-display text-lg font-extrabold tracking-tight ${
          active ? 'text-[#111827]' : 'text-[#9ca3af] group-hover:text-[#6b7280]'
        }`}
      >
        {label}
      </span>
      <span
        className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums transition-colors ${
          active ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function hasActiveRules(rules) {
  return (
    (rules.allowedRubros?.length ?? 0) > 0 || rules.onlyCashBudget || rules.onlyLogistics
  )
}

export default function MatchesAndRequests({ onOpenChat, applications: externalApplications }) {
  const [activeTab, setActiveTab] = useState('inbound')
  const [proposals, setProposals] = useState(receivedProposals)
  const [localApplications] = useState(myApplications)
  const applications = externalApplications ?? localApplications
  const [admissionRules, setAdmissionRules] = useState(DEFAULT_ADMISSION_RULES)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProposals = useMemo(
    () => filterByAdmissionRules(proposals, admissionRules),
    [proposals, admissionRules],
  )

  const hiddenCount = countHiddenByRules(proposals, admissionRules, filteredProposals)
  const rulesActive = hasActiveRules(admissionRules)

  const handleAccept = (proposalId) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'aceptado' } : p)),
    )
  }

  const handleReject = (proposalId) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId))
  }

  return (
    <div className="min-h-full bg-[#fafafa] px-8 py-10 sm:px-12 sm:py-12">
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
          Tu bandeja de matches
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
          Propuestas y Matches
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#6b7280]">
          Curá quién puede contactarte y decidí en segundos si avanzás al chat.
        </p>
      </header>

      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-end gap-8 sm:gap-10">
          <TabButton
            active={activeTab === 'inbound'}
            onClick={() => setActiveTab('inbound')}
            label="Propuestas Recibidas"
            count={proposals.length}
          />
          <TabButton
            active={activeTab === 'outbound'}
            onClick={() => setActiveTab('outbound')}
            label="Mis Postulaciones"
            count={applications.length}
          />
        </div>

        {activeTab === 'inbound' && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center gap-2.5 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
              rulesActive
                ? 'border-[#111827] bg-[#111827] text-white hover:bg-[#1f2937]'
                : 'border-[#eef0f2] bg-white text-[#374151] hover:border-[#d1d5db] hover:bg-[#fafafa]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            Reglas de Admisión
            {rulesActive && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                ON
              </span>
            )}
          </button>
        )}
      </div>

      {activeTab === 'inbound' && rulesActive && hiddenCount > 0 && (
        <p className="mb-6 text-sm text-[#9ca3af]">
          {hiddenCount} propuesta{hiddenCount !== 1 ? 's' : ''} oculta{hiddenCount !== 1 ? 's' : ''}{' '}
          por tus reglas de admisión.
        </p>
      )}

      {activeTab === 'inbound' && (
        <>
          {filteredProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#eef0f2] bg-white py-28 text-center">
              <p className="font-display text-base font-bold text-[#374151]">
                {proposals.length === 0
                  ? 'Tu bandeja está vacía'
                  : 'Ninguna propuesta pasa tu gatekeeper'}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#9ca3af]">
                {proposals.length === 0
                  ? 'Cuando una marca se interese en tu evento, aparecerá acá como invitación.'
                  : 'Ajustá tus Reglas de Admisión para ampliar o reducir el alcance.'}
              </p>
              {proposals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 text-sm font-semibold text-[#111827] underline-offset-4 hover:underline"
                >
                  Editar reglas
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredProposals.map((proposal) => (
                <InboundProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onOpenChat={onOpenChat}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'outbound' && (
        <>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#eef0f2] bg-white py-28 text-center">
              <p className="font-display text-base font-bold text-[#374151]">
                Aún no postulaste
              </p>
              <p className="mt-2 text-sm text-[#9ca3af]">
                Explorá marcas activas y postulá tu evento desde el feed principal.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <OutboundApplicationCard
                  key={application.id}
                  application={application}
                  onOpenChat={onOpenChat}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AdmissionRulesModal
        isOpen={isModalOpen}
        rules={admissionRules}
        onClose={() => setIsModalOpen(false)}
        onSave={setAdmissionRules}
        onClear={() => setAdmissionRules(DEFAULT_ADMISSION_RULES)}
      />
    </div>
  )
}
