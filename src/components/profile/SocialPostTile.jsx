import { useCallback, useEffect, useRef, useState } from 'react'
import { Heart, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SocialPostTile({ post, variant = 'default' }) {
  const compact = variant === 'compact'
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
        'group relative overflow-hidden border border-navbar-border bg-card',
        compact ? 'rounded-lg' : 'rounded-xl border-border-subtle',
        hasVideo && 'cursor-pointer',
      )}
      onMouseEnter={hasVideo ? playPreview : undefined}
      onMouseLeave={hasVideo ? stopPreview : undefined}
      onClick={hasVideo ? handleClick : undefined}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-secondary',
          compact ? 'aspect-square' : 'aspect-[4/5]',
        )}
      >
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
            className={cn(
              'h-full w-full object-cover',
              !compact && 'transition duration-300 group-hover:scale-[1.03]',
            )}
          />
        )}
        {hasVideo && !isPlaying && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <span
              className={cn(
                'flex items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm',
                compact ? 'h-7 w-7' : 'h-10 w-10',
              )}
            >
              <Play
                className={cn('fill-white', compact ? 'h-3 w-3' : 'h-4 w-4')}
                strokeWidth={0}
              />
            </span>
          </span>
        )}
        {isReel && (
          <span className="pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Play className="h-2.5 w-2.5 fill-white" strokeWidth={0} />
            {!compact && 'Video'}
          </span>
        )}
        {isStory && (
          <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-violet-600/90 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            Story
          </span>
        )}
        {!compact && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-10">
            <p className="line-clamp-2 type-small text-white/95">{post.caption}</p>
            {post.likes && (
              <p className="mt-1 inline-flex items-center gap-1 type-small text-white/80">
                <Heart className="h-3 w-3" strokeWidth={2} />
                {post.likes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
