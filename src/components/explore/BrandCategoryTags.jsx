import { cn } from '@/lib/utils'
import { getBrandCategoryTags } from '../../utils/exploreFilters'

export const BRAND_CATEGORY_TAG_CLASS =
  'rounded-full border border-neutral-300 bg-secondary/80 px-2.5 py-0.5 type-small font-semibold text-foreground/75'

export default function BrandCategoryTags({
  brand,
  max = 3,
  className,
  tagClassName,
}) {
  const tags = getBrandCategoryTags(brand, max)

  if (tags.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <li key={tag} className={cn(BRAND_CATEGORY_TAG_CLASS, tagClassName)}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
