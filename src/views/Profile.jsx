import { useState } from 'react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import ProfileEditView from '../components/profile/ProfileEditView'
import ProfilePublicView from '../components/profile/ProfilePublicView'
import ProfileWizard from '../components/profile/wizard/ProfileWizard'
import { isProfileConfigured } from '../data/hostProfile'

export default function Profile({
  profile,
  onProfileChange,
  events,
  onOpenChat,
  onGoToEvents,
}) {
  const [isPublicPreview, setIsPublicPreview] = useState(false)
  const [reopenWizard, setReopenWizard] = useState(false)
  const [commercialEventId, setCommercialEventId] = useState(null)

  const configured = isProfileConfigured(profile)
  const commercialEvent = events.find((e) => e.id === commercialEventId)

  const showWizard = !configured || reopenWizard

  const handleSave = (data) => {
    onProfileChange?.(data)
    setReopenWizard(false)
  }

  const handleWizardComplete = (data) => {
    onProfileChange?.(data)
    setReopenWizard(false)
    setIsPublicPreview(true)
    setCommercialEventId(null)
  }

  const handleSkipSetup = (data) => {
    onProfileChange?.(data)
    setReopenWizard(false)
    setIsPublicPreview(true)
  }

  if (showWizard) {
    return (
      <ProfileWizard
        profile={profile}
        onSave={handleWizardComplete}
        onSkip={handleSkipSetup}
        onCancel={configured ? () => setReopenWizard(false) : undefined}
        isEdit={configured}
      />
    )
  }

  if (commercialEventId && commercialEvent) {
    return (
      <EventCommercialSheet
        event={commercialEvent}
        hostProfile={profile}
        onBack={() => setCommercialEventId(null)}
        onOpenChat={onOpenChat}
      />
    )
  }

  if (isPublicPreview) {
    return (
      <ProfilePublicView
        profile={profile}
        events={events}
        onGoToEvents={onGoToEvents}
        onExitPreview={() => {
          setIsPublicPreview(false)
          setCommercialEventId(null)
        }}
        onEdit={() => {
          setIsPublicPreview(false)
          setCommercialEventId(null)
        }}
        onSelectEvent={(event) => setCommercialEventId(event.id)}
      />
    )
  }

  return (
    <ProfileEditView
      profile={profile}
      onSave={handleSave}
      onPreview={() => {
        setIsPublicPreview(true)
        setCommercialEventId(null)
      }}
      onReopenWizard={() => setReopenWizard(true)}
    />
  )
}
