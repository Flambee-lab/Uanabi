import { Button } from '@/components/ui/button'
import { getProfileSocialPreviewPosts } from '../../data/hostSocialFeed'
import SocialPostTile from './SocialPostTile'

export default function ProfileHeroSocialGrid({ profile, onEdit }) {
  const { posts } = getProfileSocialPreviewPosts(profile, 4)
  const hasPosts = posts.length > 0

  if (!hasPosts) {
    return (
      <div className="w-full shrink-0 sm:max-w-[13.5rem] lg:max-w-[15rem]">
        <div className="rounded-xl border border-dashed border-border-subtle px-4 py-5 text-center">
          <p className="type-small text-muted-foreground">
            Conectá tus redes para mostrar tu contenido acá.
          </p>
          {onEdit && (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              className="mt-3"
              onClick={onEdit}
            >
              Agregar redes
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full shrink-0 sm:max-w-[13.5rem] lg:max-w-[15rem]">
      <div className="grid grid-cols-2 gap-1.5">
        {posts.map((post) => (
          <SocialPostTile key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </div>
  )
}
