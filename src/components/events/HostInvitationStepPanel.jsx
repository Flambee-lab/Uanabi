import { cn } from '@/lib/utils'

const TONE_STYLES = {
  review: 'border-l-amber-500 bg-amber-50/45',
  approved: 'border-l-emerald-500 bg-emerald-50/40',
  declined: 'border-l-neutral-400 bg-neutral-50/80',
  close: 'border-l-orange-500 bg-orange-50/40',
  verification: 'border-l-sky-500 bg-sky-50/40',
}

/**
 * @param {{ tone: keyof typeof TONE_STYLES, title: string, body: string }} content
 */
export default function HostInvitationStepPanel({ content, children, className }) {
  const tone = TONE_STYLES[content.tone] ?? TONE_STYLES.review

  return (
    <div className={cn('min-w-0 flex-1', className)} aria-label={content.title}>
      <div className={cn('rounded-lg border-l-[3px] px-3 py-2.5', tone)}>
        <p className="text-sm leading-[1.45] text-foreground/85">{content.body}</p>
        {children}
      </div>
    </div>
  )
}
