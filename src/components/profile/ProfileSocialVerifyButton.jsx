import { useState } from 'react'
import { BadgeCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSocialOAuthAvailable, signInWithSocialProvider } from '../../lib/socialOAuth'

const NETWORK_LABELS = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
}

export default function ProfileSocialVerifyButton({ network, verified, disabled }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const oauthAvailable = isSocialOAuthAvailable(network)

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithSocialProvider(network)
    } catch (err) {
      setError(err?.message ?? 'No pudimos iniciar la verificación.')
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
        Verificado
      </span>
    )
  }

  if (!oauthAvailable) {
    return (
      <span className="max-w-[200px] text-right text-[10px] leading-relaxed text-neutral-400">
        {network === 'tiktok'
          ? 'TikTok: guardá tu @ manualmente (OAuth pendiente).'
          : `Activá el proveedor en Supabase → Providers.`}
      </span>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || loading}
        onClick={handleVerify}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          `Conectar ${NETWORK_LABELS[network] ?? network}`
        )}
      </Button>
      <p className="max-w-[200px] text-right text-[10px] text-neutral-400">
        {network === 'instagram'
          ? 'En Supabase activá Facebook con tu App ID/Secret de Meta (Instagram Login).'
          : 'OAuth vía Supabase — tu login local no cambia.'}
      </p>
      {error && <p className="max-w-[200px] text-right text-[10px] text-red-600">{error}</p>}
    </div>
  )
}
