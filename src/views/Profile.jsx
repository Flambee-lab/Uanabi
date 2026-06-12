import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import EventCommercialSheet from '../components/event/EventCommercialSheet'
import ProfileEditView from '../components/profile/ProfileEditView'
import ProfileInternalView from '../components/profile/ProfileInternalView'
import ProfileWizard from '../components/profile/wizard/ProfileWizard'
import { useAuth } from '../context/AuthProvider'
import { DEFAULT_HOST_PROFILE, seedProfileFromAuth, loadStoredHostProfile } from '../data/hostProfile'
import {
  fetchUserProfile,
  mapSupabaseProfileToHost,
  upsertProfilePartial,
  upsertUserProfile,
} from '../lib/profiles'
import { isLocalAuthMode } from '../lib/devLogin'
import { reconcileSocialOAuthFromSession } from '../lib/socialOAuth'
import { supabase } from '../lib/supabase'

export default function Profile({
  profile: externalProfile,
  onProfileChange,
  events = [],
  brands = [],
  onOpenChat,
  mode = 'dashboard',
  onOnboardingComplete,
  editingSection = null,
  onEditingChange,
}) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, session, saveProfile, refreshProfile, profile: authProfile } = useAuth()
  const localAuth = isLocalAuthMode()

  const [profile, setProfile] = useState(externalProfile ?? DEFAULT_HOST_PROFILE)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [isEditingInternal, setIsEditingInternal] = useState(false)
  const [editSectionInternal, setEditSectionInternal] = useState(null)
  const [commercialEventId, setCommercialEventId] = useState(null)
  const [oauthReconciling, setOauthReconciling] = useState(false)

  const usesExternalEdit = typeof onEditingChange === 'function'
  const isEditing = usesExternalEdit ? editingSection != null : isEditingInternal
  const activeEditSection = usesExternalEdit ? editingSection : editSectionInternal

  const isOnboarding = mode === 'onboarding'
  const userId = user?.id

  const loadProfileFromDb = useCallback(async () => {
    if (!userId || localAuth) {
      setProfile(authProfile ?? loadStoredHostProfile() ?? externalProfile ?? DEFAULT_HOST_PROFILE)
      return
    }

    setLoading(true)
    setLoadError('')
    try {
      const { data, error } = await fetchUserProfile(userId)
      if (error) throw error
      const mapped = mapSupabaseProfileToHost(data)
      setProfile(mapped)
    } catch (err) {
      setLoadError(err?.message ?? 'No pudimos cargar tu perfil.')
    } finally {
      setLoading(false)
    }
  }, [userId, localAuth, authProfile, externalProfile])

  useEffect(() => {
    loadProfileFromDb()
  }, [loadProfileFromDb])

  useEffect(() => {
    if (externalProfile && !isOnboarding) {
      setProfile((prev) => ({ ...prev, ...externalProfile }))
    }
  }, [externalProfile, isOnboarding])

  useEffect(() => {
    const isCallback = searchParams.get('callback') === 'true'
    if (!isCallback) return

    let active = true

    async function handleOAuthReturn() {
      setOauthReconciling(true)
      try {
        const {
          data: { session: oauthSession },
        } = await supabase.auth.getSession()
        const oauthUser = oauthSession?.user
        if (!oauthUser) return

        const { data, error } = await reconcileSocialOAuthFromSession(oauthUser, profile)
        if (!active) return
        if (error) throw error
        if (data) {
          setProfile(data)
          await refreshProfile()
        }
      } catch {
        /* el usuario puede reintentar la verificación */
      } finally {
        if (active) {
          setOauthReconciling(false)
          const next = new URLSearchParams(searchParams)
          next.delete('callback')
          setSearchParams(next, { replace: true })
        }
      }
    }

    handleOAuthReturn()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al volver del OAuth
  }, [searchParams.get('callback')])

  const persistProfile = useCallback(
    async (nextProfile, { markConfigured = false } = {}) => {
      const merged = seedProfileFromAuth(
        {
          ...nextProfile,
          isConfigured: markConfigured ? true : nextProfile.isConfigured,
        },
        user,
      )

      setSaving(true)
      try {
        if (localAuth) {
          await saveProfile(merged)
        } else if (userId) {
          const { data, error } = await upsertUserProfile(merged, userId)
          if (error) throw error
          const mapped = mapSupabaseProfileToHost(data)
          setProfile(mapped)
          await saveProfile(mapped)
        } else {
          await saveProfile(merged)
        }

        onProfileChange?.(merged)
        return merged
      } finally {
        setSaving(false)
      }
    },
    [user, userId, saveProfile, onProfileChange, localAuth],
  )

  const handleWizardSave = async (data) => {
    await persistProfile(data, { markConfigured: true })
    if (isOnboarding) {
      onOnboardingComplete?.(data)
      navigate('/dashboard', { replace: true })
    }
  }

  const handleWizardStepPersist = async (form, step) => {
    if (localAuth || !userId) return

    const { data, error } = await upsertProfilePartial(userId, {
      full_name: form.fullName?.trim() || DEFAULT_HOST_PROFILE.fullName,
      display_name: form.displayName?.trim() || null,
      whatsapp: form.whatsapp?.trim() || null,
      location: form.location?.trim() || 'CABA',
      categories: form.categories ?? [],
      instagram: form.instagram?.trim() || null,
      tiktok: form.tiktok?.trim() || null,
      social_metrics: {
        totalFollowers: form.socialMetrics?.totalFollowers ?? '',
        engagementPercent: form.socialMetrics?.engagementPercent ?? '',
      },
      is_configured: step === 3 && Boolean(form.whatsapp?.trim()),
    })
    if (error) throw error
    setProfile(mapSupabaseProfileToHost(data))
  }

  const handleSave = async (data) => {
    await persistProfile(data, { markConfigured: true })
    if (usesExternalEdit) {
      onEditingChange?.(null)
    } else {
      setIsEditingInternal(false)
      setEditSectionInternal(null)
    }
  }

  const handleEdit = (section = 'basic') => {
    if (usesExternalEdit) {
      onEditingChange?.(section)
      return
    }
    setEditSectionInternal(section)
    setIsEditingInternal(true)
  }

  const handleBackFromEdit = () => {
    if (usesExternalEdit) {
      onEditingChange?.(null)
      return
    }
    setIsEditingInternal(false)
    setEditSectionInternal(null)
  }

  if (loading || oauthReconciling) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] py-24">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        <p className="mt-3 text-xs text-neutral-500">
          {oauthReconciling ? 'Verificando red social…' : 'Cargando perfil…'}
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] px-6 py-24 text-center">
        <p className="text-sm font-medium text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={loadProfileFromDb}
          className="mt-4 text-xs font-bold text-neutral-900 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (isOnboarding) {
    return (
      <ProfileWizard
        profile={profile}
        mandatory
        fitViewport
        saving={saving}
        onPersistStep={handleWizardStepPersist}
        onSave={handleWizardSave}
      />
    )
  }

  const commercialEvent = events.find((e) => e.id === commercialEventId)

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
        saving={saving}
        onSave={handleSave}
        onBack={handleBackFromEdit}
        initialSection={activeEditSection}
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
      onOpenChat={onOpenChat}
    />
  )
}
