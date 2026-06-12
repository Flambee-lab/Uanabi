import { BadgeCheck, Link2, LoaderCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPlatformFollowers, SOCIAL_PLATFORMS } from '../../data/hostProfile'
import {
  applyDemoPlatformConnect,
  clearPlatformVerification,
  getDemoPlatformFollowers,
  getSocialVerificationStatus,
  platformSupportsConnect,
} from '../../utils/socialVerification'
import { ProfileField, profileEditInputClass } from './wizard/ProfileField'

const PLATFORM_STYLE = {
  instagram: { wrap: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', label: 'IG' },
  tiktok: { wrap: 'bg-foreground', label: 'TT' },
  twitter: { wrap: 'bg-foreground', label: 'X' },
  facebook: { wrap: 'bg-[#1877F2]', label: 'f' },
  youtube: { wrap: 'bg-[#FF0000]', label: 'YT' },
  twitch: { wrap: 'bg-[#9146FF]', label: 'Tw' },
}

function VerificationBadge({ status }) {
  if (status === 'verified') {
    return (
      <Badge variant="secondary" className="gap-1 font-normal text-emerald-700">
        <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
        Verificada
      </Badge>
    )
  }
  if (status === 'pending') {
    return (
      <Badge variant="secondary" className="font-normal italic text-muted-foreground">
        Pendiente de verificación
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="font-normal text-muted-foreground">
      Sin conectar
    </Badge>
  )
}

function PlatformIcon({ platformKey }) {
  const style = PLATFORM_STYLE[platformKey] ?? { wrap: 'bg-foreground', label: '?' }
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
        style.wrap,
      )}
      aria-hidden
    >
      {style.label}
    </div>
  )
}

export default function ProfileEditSocialChannels({ draft, profile, onUpdate }) {
  const handleConnectDemo = (platformKey) => {
    const field = SOCIAL_PLATFORMS.find((p) => p.key === platformKey)?.field
    if (!field || !draft[field]?.trim()) return
    onUpdate({
      validatedLinks: applyDemoPlatformConnect(draft.validatedLinks, platformKey),
      socialMetrics: {
        ...draft.socialMetrics,
        platformFollowers: {
          ...draft.socialMetrics.platformFollowers,
          [platformKey]: getDemoPlatformFollowers(platformKey),
        },
      },
    })
  }

  const handleDisconnect = (platformKey) => {
    onUpdate({
      validatedLinks: clearPlatformVerification(draft.validatedLinks, platformKey),
      socialMetrics: {
        ...draft.socialMetrics,
        platformFollowers: {
          ...draft.socialMetrics.platformFollowers,
          [platformKey]: '',
        },
      },
    })
  }

  const handleHandleChange = (platform, value) => {
    onUpdate({
      [platform.field]: value,
      validatedLinks: clearPlatformVerification(draft.validatedLinks, platform.key),
      socialMetrics: {
        ...draft.socialMetrics,
        platformFollowers: {
          ...draft.socialMetrics.platformFollowers,
          [platform.key]: '',
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-subtle bg-secondary/30 px-4 py-3">
        <p className="type-small text-muted-foreground">
          Conectá Instagram y TikTok para verificar que la cuenta es tuya. Los seguidores solo se
          muestran cuando la red está verificada — no podés cargarlos a mano.
        </p>
      </div>

      <div className="space-y-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          const handle = draft[platform.field] ?? ''
          const originalHandle = profile[platform.field] ?? ''
          const verified = Boolean(draft.validatedLinks?.[platform.key])
          const status = getSocialVerificationStatus({
            handle,
            verified,
            originalHandle,
          })
          const canConnect = platformSupportsConnect(platform.key)
          const followers = getPlatformFollowers(
            { ...draft, validatedLinks: draft.validatedLinks },
            platform.key,
          )

          return (
            <div
              key={platform.key}
              className="rounded-xl border border-border-subtle bg-white p-4 sm:p-5"
            >
              <div className="flex gap-3">
                <PlatformIcon platformKey={platform.key} />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="type-body font-semibold">{platform.label}</p>
                      {canConnect ? (
                        <p className="type-small text-muted-foreground">
                          Requiere conexión para verificar titularidad
                        </p>
                      ) : (
                        <p className="type-small text-muted-foreground">
                          Verificación por API próximamente
                        </p>
                      )}
                    </div>
                    <VerificationBadge status={status} />
                  </div>

                  <ProfileField label="Usuario o link">
                    <input
                      className={profileEditInputClass}
                      value={handle}
                      onChange={(e) => handleHandleChange(platform, e.target.value)}
                      placeholder="@usuario o URL completa"
                    />
                  </ProfileField>

                  {status === 'verified' && followers && (
                    <p className="type-small text-muted-foreground">
                      <span className="font-semibold text-foreground tabular-nums">{followers}</span>{' '}
                      seguidores · dato de la cuenta conectada
                    </p>
                  )}

                  {canConnect && handle.trim() && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {status !== 'verified' ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleConnectDemo(platform.key)}
                        >
                          <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
                          Conectar (demo local)
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="tertiary"
                          size="sm"
                          onClick={() => handleDisconnect(platform.key)}
                        >
                          Desconectar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ProfileField
        label="% Engagement aprox."
        hint="Opcional — ayuda a las marcas a evaluar tu alcance."
      >
        <input
          className={profileEditInputClass}
          value={draft.socialMetrics?.engagementPercent ?? ''}
          onChange={(e) =>
            onUpdate({
              socialMetrics: {
                ...draft.socialMetrics,
                engagementPercent: e.target.value,
              },
            })
          }
          placeholder="4.2"
        />
      </ProfileField>

      <p className="type-small inline-flex items-center gap-1.5 text-muted-foreground">
        <LoaderCircle className="h-3.5 w-3.5" strokeWidth={2} />
        Las APIs oficiales reemplazarán el botón demo cuando las integremos.
      </p>
    </div>
  )
}
