import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { reconcileSocialOAuthFromSession } from '../lib/socialOAuth'
import { supabase } from '../lib/supabase'

/** Procesa el retorno de OAuth de redes (Instagram, X) en cualquier ruta protegida. */
export function useSocialOAuthCallback({ profile, saveProfile, refreshProfile }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reconciling, setReconciling] = useState(false)

  useEffect(() => {
    if (searchParams.get('callback') !== 'true') return

    let active = true

    ;(async () => {
      if (!supabase) return
      setReconciling(true)
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
          await saveProfile?.(data)
          await refreshProfile?.()
        }
      } catch {
        /* el usuario puede reintentar desde Perfil → Editar */
      } finally {
        if (active) {
          setReconciling(false)
          const next = new URLSearchParams(searchParams)
          next.delete('callback')
          setSearchParams(next, { replace: true })
        }
      }
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al volver del OAuth
  }, [searchParams.get('callback')])

  return { oauthReconciling: reconciling }
}
