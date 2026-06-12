import { Badge } from '@/components/ui/badge'
import { getActiveSocialPlatforms, getProfileFeaturedPosts } from '../../data/hostSocialFeed'
import SocialPostTile from './SocialPostTile'

export default function ProfileSocialContent({ profile }) {
  const platforms = getActiveSocialPlatforms(profile)
  const posts = getProfileFeaturedPosts(profile, 6)

  if (platforms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-card px-6 py-10 text-center">
        <p className="type-body-muted">
          Conectá tus redes en editar perfil para mostrar tu contenido acá.
        </p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <p className="type-body-muted">
        Todavía no hay contenido destacado para mostrar.
      </p>
    )
  }

  return (
    <div className="space-y-3">
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
