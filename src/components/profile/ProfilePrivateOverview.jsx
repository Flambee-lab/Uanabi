import { Sparkles } from 'lucide-react'
import ProfileStatsCards from './ProfileStatsCards'

export default function ProfilePrivateOverview({ profile, stats, onEdit }) {
  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4f6e9]">
              <Sparkles className="h-5 w-5 text-[#1d230d]" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-lg font-black text-neutral-900">
                Perfil verificado activo
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {profile.successStories?.length ?? 0} casos de éxito ·{' '}
                {profile.socialMetrics?.totalFollowers} seguidores
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 rounded-[24px] border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-900 transition hover:bg-neutral-50"
          >
            Editar configuración
          </button>
        </div>
      </div>

      <ProfileStatsCards stats={stats} />
    </div>
  )
}
