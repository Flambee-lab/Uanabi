import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, Inbox, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import { isBrandPendingReview } from '../../data/brandProfile'
import { fetchInvitacionesForMarca, updateInvitacionEstado } from '../../lib/invitacionesMarcas'
import { BrandPanelShell } from '../../components/brands/BrandPanelShell'
import BrandProposalCard from '../../components/brands/BrandProposalCard'
import BrandProposalDetailModal from '../../components/brands/BrandProposalDetailModal'
import DeclineTemplateModal from '../../components/brands/DeclineTemplateModal'
import Toast from '../../components/ui/Toast'

export default function BrandDashboard() {
  const { brandProfile, logout } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)
  const [declineTarget, setDeclineTarget] = useState(null)
  const [nicheFilter, setNicheFilter] = useState('todos')
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

  const filtered = useMemo(
    () =>
      nicheFilter === 'todos'
        ? invitations
        : invitations.filter((i) => i.eventoNicho === nicheFilter),
    [invitations, nicheFilter],
  )

  const pending = filtered.filter((i) => i.estado === 'pendiente')
  const resolved = filtered.filter((i) => i.estado !== 'pendiente')

  const allPending = invitations.filter((i) => i.estado === 'pendiente')
  const allAccepted = invitations.filter((i) => i.estado === 'aceptado')
  const allDeclined = invitations.filter(
    (i) => i.estado === 'rechazado' || i.estado === 'declinado',
  )

  const stats = [
    {
      id: 'pending',
      label: 'Pendientes',
      count: allPending.length,
      icon: Clock,
      className: 'border-amber-200/80 bg-amber-50/60 text-amber-800',
      iconClassName: 'text-amber-600',
    },
    {
      id: 'accepted',
      label: 'Aceptadas',
      count: allAccepted.length,
      icon: CheckCircle2,
      className: 'border-emerald-200/80 bg-emerald-50/60 text-emerald-800',
      iconClassName: 'text-emerald-600',
    },
    {
      id: 'declined',
      label: 'Declinadas',
      count: allDeclined.length,
      icon: XCircle,
      className: 'border-slate-200/80 bg-slate-50/80 text-slate-700',
      iconClassName: 'text-slate-500',
    },
  ]

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
      <div className="space-y-6">
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
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.id}
                  className={cn('rounded-2xl border px-4 py-3.5', stat.className)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-black tabular-nums">{stat.count}</p>
                    <Icon className={cn('h-5 w-5', stat.iconClassName)} />
                  </div>
                  <p className="mt-1 text-xs font-semibold">{stat.label}</p>
                </div>
              )
            })}
          </div>
        )}

        {!loading && niches.length > 1 && (
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
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No hay propuestas de eventos de tipo "{nicheFilter}".
            </p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Pendientes ({pending.length})
                </h2>
                <div className="space-y-2">
                  {pending.map((inv) => (
                    <BrandProposalCard key={inv.id} invitation={inv} onOpen={setDetailTarget} />
                  ))}
                </div>
              </section>
            )}

            {resolved.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Historial
                </h2>
                <div className="space-y-2">
                  {resolved.map((inv) => (
                    <BrandProposalCard key={inv.id} invitation={inv} onOpen={setDetailTarget} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {detailTarget && !declineTarget && (
        <BrandProposalDetailModal
          invitation={detailTarget}
          accepting={actionId === detailTarget.id}
          onClose={() => setDetailTarget(null)}
          onAccept={handleAccept}
          onDecline={setDeclineTarget}
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
