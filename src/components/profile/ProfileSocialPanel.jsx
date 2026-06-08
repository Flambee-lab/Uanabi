import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { buildWhatsAppUrl, normalizeSocialUrl, WHATSAPP_PREFILL_MESSAGE } from '../../data/hostProfile'

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

const SOCIAL_CHANNELS = [
  {
    key: 'instagram',
    label: 'Instagram',
    field: 'instagram',
    icon: InstagramIcon,
    iconWrapClass: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    accentClass: 'text-[#E1306C]',
    metric: (profile) => profile.socialMetrics?.totalFollowers?.trim(),
    metricLabel: 'seguidores',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    field: 'tiktok',
    icon: TikTokIcon,
    iconWrapClass: 'bg-neutral-900',
    accentClass: 'text-neutral-800',
    metric: (profile) => {
      const e = profile.socialMetrics?.engagementPercent?.trim()
      return e ? `${e}%` : null
    },
    metricLabel: 'engagement',
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    field: 'twitter',
    icon: TwitterIcon,
    iconWrapClass: 'bg-neutral-900',
    accentClass: 'text-neutral-700',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    field: 'facebook',
    icon: FacebookIcon,
    iconWrapClass: 'bg-[#1877F2]',
    accentClass: 'text-[#1877F2]',
  },
]

function parseHandle(platform, value) {
  if (!value?.trim()) return null
  let v = value.trim().replace(/^@/, '')
  if (platform === 'instagram') {
    v = v.replace(/https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '')
  }
  if (platform === 'tiktok') {
    v = v.replace(/https?:\/\/(www\.)?tiktok\.com\/@?/i, '').replace(/\/$/, '')
  }
  if (platform === 'twitter') {
    v = v.replace(/https?:\/\/(www\.)?(twitter|x)\.com\//i, '').replace(/\/$/, '')
  }
  if (platform === 'facebook') {
    v = v.replace(/https?:\/\/(www\.)?facebook\.com\//i, '').replace(/\/$/, '')
  }
  return v || null
}

function SocialChannelCard({ channel, profile }) {
  const raw = profile[channel.field]
  const href = normalizeSocialUrl(channel.key === 'twitter' ? 'twitter' : channel.key, raw ?? '')
  if (!href || !raw?.trim()) return null

  const Icon = channel.icon
  const handle = parseHandle(channel.key, raw)
  const metric = channel.metric?.(profile)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3.5 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-md"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${channel.iconWrapClass}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-neutral-900">{channel.label}</p>
          <ArrowUpRight
            className="h-3.5 w-3.5 text-neutral-300 transition group-hover:text-neutral-600"
            strokeWidth={2.5}
          />
        </div>
        {handle && (
          <p className="truncate text-xs font-medium text-neutral-500">@{handle}</p>
        )}
        {metric && (
          <p className={`mt-0.5 text-xs font-bold ${channel.accentClass}`}>
            {metric} {channel.metricLabel ?? ''}
          </p>
        )}
      </div>
    </a>
  )
}

export default function ProfileSocialPanel({ profile }) {
  const showWhatsApp = profile.commercialContactEnabled !== false
  const whatsappUrl = showWhatsApp
    ? buildWhatsAppUrl(profile.whatsapp, WHATSAPP_PREFILL_MESSAGE)
    : null

  const activeChannels = SOCIAL_CHANNELS.filter((ch) => profile[ch.field]?.trim())
  const instagramValidated = profile.validatedLinks?.instagram
  const tiktokValidated = profile.validatedLinks?.tiktok

  if (activeChannels.length === 0 && !whatsappUrl) return null

  return (
    <div className="rounded-2xl border border-neutral-100 bg-gradient-to-b from-white to-neutral-50/90 p-4 sm:p-5">
      {activeChannels.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Redes sociales
            </p>
            {(instagramValidated || tiktokValidated) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
                Verificado
              </span>
            )}
          </div>
          <div className="space-y-2">
            {SOCIAL_CHANNELS.map((channel) => (
              <SocialChannelCard key={channel.key} channel={channel} profile={profile} />
            ))}
          </div>
        </>
      )}

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#25D366]/20 transition hover:bg-[#20bd5a] ${activeChannels.length > 0 ? 'mt-3' : ''}`}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Contactar
        </a>
      )}
    </div>
  )
}
