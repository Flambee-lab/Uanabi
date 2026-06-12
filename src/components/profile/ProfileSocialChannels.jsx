import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getConnectedSocialChannels, getPlatformFollowers } from '../../data/hostProfile'

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

function YouTubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TwitchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  )
}

const PLATFORM_ICONS = {
  instagram: { Icon: InstagramIcon, wrap: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
  tiktok: { Icon: TikTokIcon, wrap: 'bg-foreground' },
  twitter: { Icon: TwitterIcon, wrap: 'bg-foreground' },
  facebook: { Icon: FacebookIcon, wrap: 'bg-[#1877F2]' },
  youtube: { Icon: YouTubeIcon, wrap: 'bg-[#FF0000]' },
  twitch: { Icon: TwitchIcon, wrap: 'bg-[#9146FF]' },
}

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
  if (platform === 'youtube') {
    v = v.replace(/https?:\/\/(www\.)?youtube\.com\/@?/i, '').replace(/\/$/, '')
  }
  if (platform === 'twitch') {
    v = v.replace(/https?:\/\/(www\.)?twitch\.tv\//i, '').replace(/\/$/, '')
  }
  return v || null
}

function SocialChannelRow({ channel }) {
  const { key, label, handle, url, followers, verified } = channel
  const meta = PLATFORM_ICONS[key]
  if (!meta) return null

  const { Icon, wrap } = meta
  const displayHandle = parseHandle(key, handle)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 py-2.5"
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          wrap,
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="type-small inline-flex min-w-0 items-center gap-1 font-semibold text-foreground">
            <span className="truncate">{label}</span>
            <ArrowUpRight
              className="h-3 w-3 shrink-0 text-muted-foreground/50 transition group-hover:text-muted-foreground"
              strokeWidth={2.5}
            />
          </p>
          {followers ? (
            <span className="type-small shrink-0 font-semibold tabular-nums text-foreground">
              {followers}
            </span>
          ) : (
            <span className="type-small shrink-0 text-muted-foreground">—</span>
          )}
        </div>
        <p className="type-small mt-0.5 truncate text-muted-foreground">
          {displayHandle ? `@${displayHandle}` : label}
          <span aria-hidden> · </span>
          {verified ? (
            <span className="inline-flex items-center gap-0.5 font-medium text-emerald-700">
              <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
              Verificado
            </span>
          ) : (
            <span className="italic">Pendiente de verificación</span>
          )}
        </p>
      </div>
    </a>
  )
}

export default function ProfileSocialChannels({ profile }) {
  const channels = getConnectedSocialChannels(profile)

  if (channels.length === 0) {
    return (
      <p className="type-body-muted">
        Agregá tus redes para que las marcas vean tu alcance en cada canal.
      </p>
    )
  }

  return (
    <div className="divide-y divide-border-subtle">
      {channels.map((channel) => (
        <SocialChannelRow key={channel.key} channel={channel} />
      ))}
      <p className="type-small pt-2.5 text-muted-foreground">
        Los seguidores aparecen solo en redes verificadas.
      </p>
    </div>
  )
}

export function formatPlatformFollowerLabel(profile, platform) {
  const followers = getPlatformFollowers(profile, platform)
  return followers ? `${followers} seguidores` : null
}
