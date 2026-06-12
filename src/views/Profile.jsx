import { useState } from 'react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import ProfileEditView from '../components/profile/ProfileEditView'
import ProfileInternalView from '../components/profile/ProfileInternalView'

export default function Profile({
  profile,
  onProfileChange,
  events,
  brands = [],
  editingSection = null,
  onEditingChange,
}) {
  const [commercialEventId, setCommercialEventId] = useState(null)

  const commercialEvent = events.find((e) => e.id === commercialEventId)
  const isEditing = editingSection != null

  const handleSave = (data) => {
    onProfileChange?.(data)
    onEditingChange?.(null)
  }

  if (commercialEventId && commercialEvent) {
    return (
      <EventCommercialSheet
        event={commercialEvent}
        hostProfile={profile}
        brands={brands}
        onBack={() => setCommercialEventId(null)}
      />
    )
  }

  if (isEditing) {
    return (
      <ProfileEditView
        profile={profile}
        onSave={handleSave}
        onBack={() => onEditingChange?.(null)}
        initialSection={editingSection}
      />
    )
  }

  return (
    <ProfileInternalView
      profile={profile}
      events={events}
      brands={brands}
      onEdit={(section = 'basic') => onEditingChange?.(section)}
      onSelectEvent={(eventId) => setCommercialEventId(eventId)}
    />
  )
}
