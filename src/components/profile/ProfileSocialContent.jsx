import { useCallback, useEffect, useRef, useState } from 'react'
import { Heart, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HOST_SOCIAL_FEED, getActiveSocialPlatforms } from '../../data/hostSocialFeed'
import { getPlatformFollowers, normalizeSocialUrl } from '../../data/hostProfile'

const PLATFORM_META = {
  instagram: { label: 'Instagram', handleField: 'instagram' },
  tiktok: { label: 'TikTok', handleField: 'tiktok' },
}

function parseHandle(value) {
  if (!value?.trim()) return null
  return value.trim().replace(/^@/, '').replace(/https?:\/\/[^/]+\//i, '').replace(/\/$/, '')
}

function SocialPostTile({ post }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const isReel = post.type === 'reel'
  const isStory = post.type === 'story'
  const hasVideo = Boolean(post.videoUrl)
  const startAt = post.startAt ?? 0

  const seekToStart = useCallback(
    (video) => {
      if (!video || !hasVideo) return
      const target = Math.min(startAt, Math.max(0, (video.duration || startAt + 1) - 0.05))
      if (Math.abs(video.currentTime - target) > 0.15) {
        video.currentTime = target
      }
    },
    [hasVideo, startAt],
  )

  const freezeFrame = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    seekToStart(video)
    setIsPlaying(false)
  }, [seekToStart])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasVideo) return

    setFrameReady(false)

    const primeFrame = () => {
      seekToStart(video)
      video.pause()
      setFrameReady(true)
    }

    if (video.readyState >= 2) primeFrame()
    else video.addEventListener('loadeddata', primeFrame, { once: true })

    return () => video.removeEventListener('loadeddata', primeFrame)
  }, [hasVideo, post.videoUrl, seekToStart, startAt])

  const playPreview = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    try {
      if (video.readyState < 2) {
        await new Promise((resolve) => {
          video.addEventListener('loadeddata', resolve, { once: true })
          video.load()
        })
      }
      seekToStart(video)
      await video.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [seekToStart])

  const stopPreview = useCallback(() => {
    freezeFrame()
  }, [freezeFrame])

  const handleEnded = useCallback(() => {
    const video = videoRef.current
    if (!video || !isPlaying) return
    seekToStart(video)
    video.play().catch(() => setIsPlaying(false))
  }, [isPlaying, seekToStart])

  const handleClick = (e) => {
    if (!hasVideo) return
    const prefersHover = window.matchMedia('(hover: hover)').matches
    if (prefersHover && e.pointerType !== 'touch') return
    e.preventDefault()
    if (isPlaying) stopPreview()
    else playPreview()
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border-subtle bg-card',
        hasVideo && 'cursor-pointer',
      )}
      onMouseEnter={hasVideo ? playPreview : undefined}
      onMouseLeave={hasVideo ? stopPreview : undefined}
      onClick={hasVideo ? handleClick : undefined}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {hasVideo ? (
          <>
            {!frameReady && (
              <img
                src={post.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <video
              ref={videoRef}
              src={post.videoUrl}
              muted
              playsInline
              preload="auto"
              className={cn(
                'h-full w-full object-cover transition-opacity duration-200',
                frameReady ? 'opacity-100' : 'opacity-0',
              )}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleEnded}
            />
          </>
        ) : (
          <img
            src={post.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        )}
        {hasVideo && !isPlaying && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
              <Play className="h-4 w-4 fill-white" strokeWidth={0} />
            </span>
          </span>
        )}
        {isReel && (
          <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-white" strokeWidth={0} />
            Video
          </span>
        )}
        {isStory && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-violet-600/90 px-2 py-0.5 text-[11px] font-semibold text-white">
            Story
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-10">
          <p className="line-clamp-2 type-small text-white/95">{post.caption}</p>
          <p className="mt-1 inline-flex items-center gap-1 type-small text-white/80">
            <Heart className="h-3 w-3" strokeWidth={2} />
            {post.likes}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ProfileSocialContent({ profile }) {
  const platforms = getActiveSocialPlatforms(profile)
  const defaultPlatform = platforms.includes('tiktok') ? 'tiktok' : platforms[0]
  const [active, setActive] = useState(defaultPlatform ?? 'instagram')

  if (platforms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-card px-6 py-10 text-center">
        <p className="type-body-muted">Conectá tus redes en editar perfil para mostrar tu contenido acá.</p>
      </div>
    )
  }

  const posts = HOST_SOCIAL_FEED[active] ?? []
  const meta = PLATFORM_META[active]
  const handle = parseHandle(profile[meta.handleField])
  const profileUrl = normalizeSocialUrl(active, profile[meta.handleField] ?? '')
  const activeFollowers = getPlatformFollowers(profile, active)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border-subtle bg-secondary/50 p-1">
          {platforms.map((platform) => {
            const followers = getPlatformFollowers(profile, platform)
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setActive(platform)}
                className={cn(
                  'rounded-full px-4 py-1.5 type-small font-semibold transition',
                  active === platform
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {PLATFORM_META[platform].label}
                {followers ? ` · ${followers}` : ''}
              </button>
            )
          })}
        </div>
        {handle && profileUrl && (
          <div className="text-right">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-small font-semibold text-primary hover:underline"
            >
              @{handle}
            </a>
            {activeFollowers && (
              <p className="type-small font-semibold text-foreground">
                {activeFollowers} seguidores
              </p>
            )}
          </div>
        )}
      </div>

      <p className="type-small text-muted-foreground">
        Pasá el mouse o tocá un video para reproducir la preview (demo).
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {posts.map((post) => (
          <SocialPostTile key={post.id} post={post} />
        ))}
      </div>

      <Badge variant="secondary" className="font-normal">
        Contenido de ejemplo — integración con APIs de redes en roadmap
      </Badge>
    </div>
  )
}
