import { createFreshHostProfile } from '../data/appSession'
import {
  DEFAULT_HOST_PROFILE,
  isProfileConfigured,
} from '../data/hostProfile'
import { supabase } from './supabase'

export function mapSupabaseProfileToHost(row) {
  if (!row) return createFreshHostProfile()

  return {
    ...createFreshHostProfile(),
    fullName: row.full_name?.trim() || '',
    displayName: row.display_name?.trim() || '',
    bio: row.bio?.trim() || '',
    avatarUrl: row.avatar_url || null,
    location: row.location?.trim() || DEFAULT_HOST_PROFILE.location,
    categories: Array.isArray(row.categories) ? row.categories : [],
    whatsapp: row.whatsapp?.trim() || '',
    instagram: row.instagram?.trim() || '',
    tiktok: row.tiktok?.trim() || '',
    twitter: row.twitter?.trim() || '',
    facebook: row.facebook?.trim() || '',
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
    is_configured: Boolean(profile.isConfigured),
    updated_at: new Date().toISOString(),
  }
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

export { isProfileConfigured }
