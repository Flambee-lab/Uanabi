import { Calendar, MapPin } from 'lucide-react'
import { formatJoinedDate, HOST_LOCATION } from '../../data/hostProfile'

export default function ProfileAboutCard({ profile }) {
  const location = profile.location?.trim() || HOST_LOCATION
  const bio =
    profile.bio?.trim() ||
    'Host en Capital Federal con experiencias presenciales y conexión directa con marcas.'

  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sobre mí</p>

      <div className="mt-3 flex items-start gap-2.5">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" strokeWidth={1.75} />
        <div>
          <p className="text-xs font-bold text-neutral-900">{location}, Argentina</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">Capital Federal</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-neutral-600">{bio}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
        <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        En Uanabi desde {formatJoinedDate(profile.joinedAt)}
      </div>
    </div>
  )
}
