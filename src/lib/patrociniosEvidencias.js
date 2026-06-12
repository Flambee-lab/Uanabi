import { SPONSORSHIP_STATUS } from '../utils/sponsorshipLifecycle'
import { supabase } from './supabase'

const EVIDENCIAS_BUCKET = 'evidencias'

function buildStoragePath(userId, eventId, brandId, fileName) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${userId}/${eventId}/${brandId}/${Date.now()}-${safeName}`
}

export async function uploadEvidenceFile({ userId, eventId, brandId, file }) {
  if (!supabase) throw new Error('Supabase no está configurado')

  const path = buildStoragePath(userId, eventId, brandId, file.name)
  const { error: uploadError } = await supabase.storage
    .from(EVIDENCIAS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(EVIDENCIAS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function submitPatrocinioEvidencias({
  userId,
  eventId,
  brandId,
  delivered,
  rating,
  review,
  photoFiles = [],
}) {
  if (!supabase) throw new Error('Supabase no está configurado')

  const photoUrls = []
  for (const file of photoFiles) {
    const url = await uploadEvidenceFile({ userId, eventId, brandId, file })
    photoUrls.push(url)
  }

  const { data, error } = await supabase
    .from('patrocinios_evidencias')
    .insert({
      user_id: userId,
      event_id: eventId,
      brand_id: brandId,
      delivered,
      rating: rating || null,
      review: review?.trim() || null,
      photo_urls: photoUrls,
      status: SPONSORSHIP_STATUS.EN_VERIFICACION,
    })
    .select()
    .single()

  if (error) throw error

  return {
    record: data,
    photoUrls,
    status: SPONSORSHIP_STATUS.EN_VERIFICACION,
  }
}
