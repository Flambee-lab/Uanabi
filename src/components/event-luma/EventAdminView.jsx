import { useState } from 'react'
import EventEditModal from './EventEditModal'
import EventSponsorsManage from './EventSponsorsManage'
import EventSummaryBar from './EventSummaryBar'

export default function EventAdminView({
  event,
  invitedBrands,
  suggestedBrands,
  onInvite,
  onOpenChat,
  onEventUpdate,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <div className="min-h-full bg-white px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <EventSummaryBar event={event} onEdit={() => setIsEditOpen(true)} />

        <EventSponsorsManage
          event={event}
          invitedSponsors={invitedBrands}
          suggestedSponsors={suggestedBrands}
          onInvite={onInvite}
          onOpenChat={onOpenChat}
        />
      </div>

      <EventEditModal
        event={event}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={onEventUpdate}
      />
    </div>
  )
}
