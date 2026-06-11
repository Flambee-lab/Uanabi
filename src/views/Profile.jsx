import { useState } from 'react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import ProfileEditView from '../components/profile/ProfileEditView'
import ProfileInternalView from '../components/profile/ProfileInternalView'

export default function Profile({
  profile,
  onProfileChange,
  events,
  brands = [],
  onOpenChat,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editSection, setEditSection] = useState(null)
  const [commercialEventId, setCommercialEventId] = useState(null)

  const commercialEvent = events.find((e) => e.id === commercialEventId)

  const handleSave = (data) => {
    onProfileChange?.(data)
    setIsEditing(false)
    setEditSection(null)
  }

  const handleEdit = (section = 'basic') => {
    setEditSection(section)
    setIsEditing(true)
  }

  const handleBackFromEdit = () => {
    setIsEditing(false)
    setEditSection(null)
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
        onBack={handleBackFromEdit}
        initialSection={editSection}
      />
    )
  }

  return (
    <ProfileInternalView
      profile={profile}
      events={events}
      brands={brands}
      onEdit={handleEdit}
      onSelectEvent={(eventId) => setCommercialEventId(eventId)}
    />
  )
}
