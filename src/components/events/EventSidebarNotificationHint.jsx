import { cn } from '@/lib/utils'
import { getInlineNotificationDotClass } from '../../utils/eventInlineNotifications'

export default function EventSidebarNotificationHint({ notifications = [], className }) {
  if (!notifications.length) return null

  const primary = notifications[0]
  const extra = notifications.length - 1
  const dotClass = getInlineNotificationDotClass(primary.type)

  return (
    <div
      className={cn(
        'mx-2 flex items-center gap-1.5 rounded-md bg-secondary/70 px-2 py-1 text-[11px] font-medium leading-tight text-foreground/70',
        className,
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate">{primary.title}</span>
      {extra > 0 && (
        <span className="shrink-0 tabular-nums text-muted-foreground">+{extra}</span>
      )}
    </div>
  )
}
