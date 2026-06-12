import { createFreshHostProfile } from '../data/appSession'
import { DEFAULT_HOST_PROFILE } from '../data/hostProfile'
import { supabase } from './supabase'

export function isProfilesSchemaMissingError(error) {
  const message = String(error?.message ?? error ?? '').toLowerCase()
  return (
    message.includes('schema cache') ||
    message.includes("could not find the table") ||
    message.includes('relation "public.profiles" does not exist') ||
    (message.includes('profiles') && message.includes('does not exist'))
  )
}

export function getProfilesSchemaErrorMessage() {
  return 'Falta crear la tabla profiles en Supabase. Ejecutá supabase/schema.sql en el SQL Editor del proyecto.'
}

export function mapSupabaseProfileToHost(row) {
  if (!row) return createFreshHostProfile()

  const metrics = row.social_metrics ?? {}

  return {
    ...createFreshHostProfile(),
    fullName: row.full_name?.trim() || '',
    displayName: row.display_name?.trim() || '',
    bio: row.bio?.trim() || '',
    avatarUrl: row.avatar_url || null,
    location: row.location?.trim() || DEFAULT_HOST_PROFILE.location,
    categories: Array.isArray(row.categories) ? row.categories : [],
    whatsapp: row.whatsapp?.trim() || '',
    instagram: row.instagram?.trim() || row.instagram_username?.trim() || '',
    tiktok: row.tiktok?.trim() || row.tiktok_username?.trim() || '',
    twitter: row.twitter?.trim() || row.twitter_username?.trim() || '',
    youtube: row.youtube?.trim() || '',
    twitch: row.twitch?.trim() || '',
    facebook: row.facebook?.trim() || '',
    socialMetrics: {
      totalFollowers: metrics.totalFollowers ?? metrics.total_followers ?? '',
      engagementPercent: metrics.engagementPercent ?? metrics.engagement_percent ?? '',
    },
    validatedLinks: {
      instagram: Boolean(row.is_instagram_verified),
      tiktok: Boolean(row.is_tiktok_verified),
      twitter: Boolean(row.is_twitter_verified),
    },
    isConfigured: Boolean(row.is_configured),
    joinedAt: row.created_at ?? null,
  }
}

export function mapHostProfileToSupabase(profile, userId) {
  return {
    id: userId,
    full_name: profile.fullName?.trim() || profile.displayName?.trim() || null,
    display_name: profile.displayName?.trim() || null,
    whatsapp: profile.whatsapp?.trim() || null,
    categories: profile.categories ?? [],
    location: profile.location?.trim() || 'CABA',
    bio: profile.bio?.trim() || null,
    avatar_url: profile.avatarUrl || null,
    instagram: profile.instagram?.trim() || null,
    tiktok: profile.tiktok?.trim() || null,
    twitter: profile.twitter?.trim() || null,
    youtube: profile.youtube?.trim() || null,
    twitch: profile.twitch?.trim() || null,
    facebook: profile.facebook?.trim() || null,
    instagram_username: profile.instagram?.trim()?.replace(/^@/, '') || null,
    tiktok_username: profile.tiktok?.trim()?.replace(/^@/, '') || null,
    twitter_username: profile.twitter?.trim()?.replace(/^@/, '') || null,
    is_instagram_verified: Boolean(profile.validatedLinks?.instagram),
    is_tiktok_verified: Boolean(profile.validatedLinks?.tiktok),
    is_twitter_verified: Boolean(profile.validatedLinks?.twitter),
    social_metrics: {
      totalFollowers: profile.socialMetrics?.totalFollowers ?? '',
      engagementPercent: profile.socialMetrics?.engagementPercent ?? '',
    },
    is_configured: Boolean(profile.isConfigured),
    updated_at: new Date().toISOString(),
  }
}

/** Gatekeeper: perfil listo solo tras completar el wizard de registro */
export function isProfileConfigured(profile) {
  if (!profile) return false
  return Boolean(profile.isConfigured)
}

export async function fetchUserProfile(userId) {
  if (!supabase || !userId) {
    return { data: null, error: new Error('Supabase no configurado') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error && isProfilesSchemaMissingError(error)) {
    return { data: null, error: new Error(getProfilesSchemaErrorMessage()) }
  }

  return { data, error }
}

export async function upsertUserProfile(profile, userId) {
  if (!supabase || !userId) {
    return { data: null, error: new Error('Supabase no configurado') }
  }

  const payload = mapHostProfileToSupabase(profile, userId)
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  return { data, error }
}

export async function upsertProfilePartial(userId, partial) {
  if (!supabase || !userId) {
    return { data: null, error: new Error('Supabase no configurado') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        ...partial,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single()

  return { data, error }
}
