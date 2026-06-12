import { useCallback, useEffect, useMemo, useState } from 'react'
import { Inbox, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import { isBrandPendingReview } from '../../data/brandProfile'
import { fetchInvitacionesForMarca, updateInvitacionEstado } from '../../lib/invitacionesMarcas'
import { BrandPanelShell } from '../../components/brands/BrandPanelShell'
import BrandProposalCard from '../../components/brands/BrandProposalCard'
import BrandProposalDetailModal from '../../components/brands/BrandProposalDetailModal'
import DeclineTemplateModal from '../../components/brands/DeclineTemplateModal'
import Toast from '../../components/ui/Toast'

const STATUS_TABS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aceptado', label: 'Aceptadas' },
  { id: 'declinado', label: 'Declinadas' },
]

const EMPTY_TAB_MESSAGES = {
  todas: 'No hay propuestas que coincidan con tu búsqueda.',
  pendiente: 'No tenés propuestas pendientes de respuesta. ¡Estás al día!',
  aceptado: 'Todavía no aceptaste ninguna propuesta.',
  declinado: 'No declinaste ninguna propuesta.',
}

function matchesStatus(invitation, tab) {
  if (tab === 'todas') return true
  if (tab === 'declinado') {
    return invitation.estado === 'rechazado' || invitation.estado === 'declinado'
  }
  if (tab === 'pendiente') {
    // Las contraofertas siguen sin resolución, cuentan como pendientes
    return invitation.estado === 'pendiente' || invitation.estado === 'contraoferta'
  }
  return invitation.estado === tab
}

function matchesSearch(invitation, query) {
  if (!query) return true
  const haystack = [
    invitation.eventoTitulo,
    invitation.hostNombre,
    invitation.hostComunidad,
    invitation.eventoUbicacion,
    invitation.eventoNicho,
    ...(invitation.productosSolicitados ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

/** Pendientes primero ordenadas por deadline de stock; el resto por fecha de llegada */
function sortInvitations(list) {
  return [...list].sort((a, b) => {
    const aPending = a.estado === 'pendiente'
    const bPending = b.estado === 'pendiente'
    if (aPending !== bPending) return aPending ? -1 : 1
    if (aPending && bPending) {
      const aDeadline = a.fechaLimiteEntrega ?? '9999'
      const bDeadline = b.fechaLimiteEntrega ?? '9999'
      return aDeadline.localeCompare(bDeadline)
    }
    return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
  })
}

export default function BrandDashboard() {
  const { brandProfile, logout } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)
  const [declineTarget, setDeclineTarget] = useState(null)
  const [statusTab, setStatusTab] = useState('todas')
  const [nicheFilter, setNicheFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  const marcaNombre = brandProfile?.marcaNombre ?? 'VitalSport'

  const loadInvitations = useCallback(async () => {
    setLoading(true)
    const { data } = await fetchInvitacionesForMarca(marcaNombre)
    setInvitations(data ?? [])
    setLoading(false)
  }, [marcaNombre])

  useEffect(() => {
    loadInvitations()
  }, [loadInvitations])

  const niches = useMemo(() => {
    const set = new Set(invitations.map((i) => i.eventoNicho).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [invitations])

  // Pipeline: nicho + búsqueda → base para contar tabs y listar
  const base = useMemo(() => {
    const query = search.trim().toLowerCase()
    return invitations.filter(
      (i) =>
        (nicheFilter === 'todos' || i.eventoNicho === nicheFilter) &&
        matchesSearch(i, query),
    )
  }, [invitations, nicheFilter, search])

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        STATUS_TABS.map(({ id }) => [id, base.filter((i) => matchesStatus(i, id)).length]),
      ),
    [base],
  )

  const visible = useMemo(
    () => sortInvitations(base.filter((i) => matchesStatus(i, statusTab))),
    [base, statusTab],
  )

  const visiblePending = visible.filter((i) => i.estado === 'pendiente')
  const visibleResolved = visible.filter((i) => i.estado !== 'pendiente')

  const applyUpdate = (id, data) => {
    setInvitations((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
    setDetailTarget((current) => (current?.id === id ? { ...current, ...data } : current))
  }

  const handleAccept = async (invitation) => {
    setActionId(invitation.id)
    const { data, error } = await updateInvitacionEstado(invitation.id, { estado: 'aceptado' })
    setActionId(null)
    if (error) {
      setToast({ title: 'Error', message: 'No pudimos aceptar la propuesta.' })
      return
    }
    applyUpdate(invitation.id, data)
    setToast({
      title: '¡Trato aceptado!',
      message: 'Ya podés ver el contacto del host en la propuesta.',
    })
  }

  const handleCounterOffer = async (invitation, mensaje) => {
    setActionId(invitation.id)
    const { data, error } = await updateInvitacionEstado(invitation.id, {
      estado: 'contraoferta',
      mensajeRespuesta: mensaje,
    })
    setActionId(null)
    if (error) {
      setToast({ title: 'Error', message: 'No pudimos enviar la contraoferta.' })
      return
    }
    applyUpdate(invitation.id, data)
    setToast({
      title: 'Contraoferta enviada',
      message: 'El host la verá en su panel y puede contactarte para renegociar.',
    })
  }

  const handleDeclineConfirm = async (invitation, mensaje) => {
    setActionId(invitation.id)
    const { data, error } = await updateInvitacionEstado(invitation.id, {
      estado: 'rechazado',
      mensajeRespuesta: mensaje,
    })
    setActionId(null)
    setDeclineTarget(null)
    if (error) {
      setToast({ title: 'Error', message: 'No pudimos enviar el rechazo.' })
      return
    }
    applyUpdate(invitation.id, data)
    setToast({
      title: 'Respuesta enviada',
      message: 'El host recibirá tu mensaje amigable en su panel.',
    })
  }

  const pendingReview = isBrandPendingReview(brandProfile)

  return (
    <BrandPanelShell
      brandName={marcaNombre}
      activeNav="dashboard"
      onLogout={logout}
    >
      <div className="space-y-5">
        {pendingReview && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3.5">
            <p className="text-sm font-semibold text-amber-900">Verificación en revisión</p>
            <p className="mt-1 text-sm text-amber-950/80">
              Nuestro equipo está revisando tu marca. Podés gestionar propuestas mientras tanto.
            </p>
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
            Solicitudes de patrocinio
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Eventos que te invitaron — entrá a cada propuesta para ver el detalle y responder.
          </p>
        </div>

        {!loading && invitations.length > 0 && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
                {STATUS_TABS.map(({ id, label }) => {
                  const active = statusTab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStatusTab(id)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition',
                        active
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800',
                      )}
                    >
                      {label}
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-black tabular-nums',
                          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {tabCounts[id] ?? 0}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar evento, host o producto…"
                />
              </div>
            </div>

            {niches.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Tipo de evento
                </span>
                {['todos', ...niches].map((niche) => {
                  const active = nicheFilter === niche
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setNicheFilter(niche)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition',
                        active
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-400/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200',
                      )}
                    >
                      {niche === 'todos' ? 'Todos' : niche}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Cargando propuestas…</p>
        ) : invitations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No hay propuestas por ahora</p>
            <p className="mt-1 text-xs text-slate-400">
              Cuando un host te invite, aparecerá acá automáticamente.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-slate-500">{EMPTY_TAB_MESSAGES[statusTab]}</p>
            {(search.trim() || nicheFilter !== 'todos') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setNicheFilter('todos')
                }}
                className="mt-3 text-xs font-bold text-emerald-600 underline-offset-2 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : statusTab === 'todas' ? (
          <>
            {visiblePending.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Pendientes de respuesta ({visiblePending.length})
                </h2>
                <div className="space-y-2">
                  {visiblePending.map((inv) => (
                    <BrandProposalCard key={inv.id} invitation={inv} onOpen={setDetailTarget} />
                  ))}
                </div>
              </section>
            )}

            {visibleResolved.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Historial
                </h2>
                <div className="space-y-2">
                  {visibleResolved.map((inv) => (
                    <BrandProposalCard key={inv.id} invitation={inv} onOpen={setDetailTarget} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {visible.map((inv) => (
              <BrandProposalCard key={inv.id} invitation={inv} onOpen={setDetailTarget} />
            ))}
          </div>
        )}
      </div>

      {detailTarget && !declineTarget && (
        <BrandProposalDetailModal
          invitation={detailTarget}
          marcaNombre={marcaNombre}
          accepting={actionId === detailTarget.id}
          countering={actionId === detailTarget.id}
          onClose={() => setDetailTarget(null)}
          onAccept={handleAccept}
          onDecline={setDeclineTarget}
          onCounterOffer={handleCounterOffer}
        />
      )}

      <DeclineTemplateModal
        isOpen={Boolean(declineTarget)}
        invitation={declineTarget}
        brandProfile={brandProfile}
        onClose={() => setDeclineTarget(null)}
        onConfirm={handleDeclineConfirm}
        confirming={Boolean(actionId)}
      />

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </BrandPanelShell>
  )
}
