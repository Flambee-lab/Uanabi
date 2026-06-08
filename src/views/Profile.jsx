import { useState } from 'react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import ProfileEditView from '../components/profile/ProfileEditView'
import ProfilePublicView from '../components/profile/ProfilePublicView'

export default function Profile({
  profile,
  onProfileChange,
  events,
  brands = [],
  onOpenChat,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [commercialEventId, setCommercialEventId] = useState(null)

  const commercialEvent = events.find((e) => e.id === commercialEventId)

  const handleSave = (data) => {
    onProfileChange?.(data)
    setIsEditing(false)
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
        onBack={() => setIsEditing(false)}
      />
    )
  }

  return (
    <ProfilePublicView
      profile={profile}
      events={events}
      brands={brands}
      onEdit={() => setIsEditing(true)}
      onSelectEvent={(event) => setCommercialEventId(event.id)}
    />
  )
}
