import { useState } from 'react'
import { ImagePlus, Loader2, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MAX_PHOTOS = 3

export default function SponsorshipCloseCaseModal({
  isOpen,
  onClose,
  caseInfo,
  onSubmit,
}) {
  const [step, setStep] = useState(1)
  const [delivered, setDelivered] = useState(null)
  const [photos, setPhotos] = useState([])
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !caseInfo) return null

  const reset = () => {
    setStep(1)
    setDelivered(null)
    setPhotos([])
    setRating(0)
    setReview('')
    setSuccess(false)
    setSubmitting(false)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const addPhotos = (fileList) => {
    const next = Array.from(fileList).slice(0, MAX_PHOTOS - photos.length)
    setPhotos((prev) => [
      ...prev,
      ...next.map((file) => ({
        id: `ph-${Date.now()}-${file.name}`,
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ])
  }

  const handleFinalSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      await onSubmit?.({
        delivered,
        photos,
        photoFiles: photos.map((p) => p.file).filter(Boolean),
        rating,
        review,
        submittedAt: new Date().toISOString(),
      })
      setSuccess(true)
    } catch (err) {
      setError(err?.message ?? 'No pudimos enviar las evidencias. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-[modal-enter_0.25s_ease-out] w-full max-w-lg rounded-2xl border border-border-subtle bg-white">
        <div className="flex items-start justify-between border-b border-border-subtle px-8 py-6">
          <div>
            <p className="type-label ">
              Paso {success ? '✓' : step} de 3
            </p>
            <h2 className="mt-1 font-display text-xl font-black tracking-tight text-foreground">
              {success
                ? 'Pruebas enviadas'
                : 'Finalizar Patrocinio y Validar Marcas'}
            </h2>
            {!success && (
              <p className="mt-1 text-xs text-muted-foreground">
                {caseInfo.brandName} · {caseInfo.eventTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="px-8 py-8">
          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Recibimos tus pruebas. Uanabi verificará el caso en las próximas 24 horas para
                impactar las marcas en tu perfil público.
              </p>
              <Button type="button" variant="primary" size="lg" onClick={handleClose}>
                Entendido
              </Button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
              <p className="text-sm font-medium text-foreground">
                ¿La marca entregó los productos o el presupuesto acordado?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Sí', 'No'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled={busy}
                    onClick={() => setDelivered(label === 'Sí')}
                    className={`rounded-2xl border py-4 text-sm font-bold transition disabled:opacity-60 ${
                      delivered === (label === 'Sí')
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-white text-foreground/80 hover:border-muted-foreground/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">
                Subí evidencia visual del patrocinio
              </p>
              <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border p-8 text-center transition hover:border-muted-foreground/40">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={busy || photos.length >= MAX_PHOTOS}
                  onChange={(e) => {
                    addPhotos(e.target.files)
                    e.target.value = ''
                  }}
                />
                <ImagePlus className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
                <p className="mt-3 text-xs font-bold text-foreground/80">
                  + Subir fotos del evento (Banners, stands o producto entregado)
                </p>
                <p className="mt-1 type-small text-muted-foreground">
                  Hasta {MAX_PHOTOS} fotos · {photos.length}/{MAX_PHOTOS}
                </p>
              </label>
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="h-16 w-16 overflow-hidden rounded-lg border border-border-subtle"
                    >
                      <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-medium text-foreground">
                Calificá tu experiencia con la marca
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={busy}
                    onClick={() => setRating(n)}
                    className="rounded-lg p-1 transition hover:bg-secondary disabled:opacity-60"
                    aria-label={`${n} estrellas`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        n <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-200'
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-xs text-foreground focus:border-primary focus:bg-white focus:outline-none disabled:opacity-60"
                rows={3}
                placeholder="Reseña interna sobre la marca (opcional)"
                value={review}
                disabled={busy}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        {!success && (
          <div className="flex items-center justify-between border-t border-border-subtle px-8 py-6">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              disabled={busy}
              className="text-muted-foreground hover:text-foreground/80"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
            >
              {step > 1 ? 'Volver' : 'Cancelar'}
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                variant="primary"
                size="default"
                disabled={busy || (step === 1 && delivered === null)}
                onClick={() => setStep((s) => s + 1)}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="default"
                disabled={busy}
                onClick={handleFinalSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo evidencias…
                  </>
                ) : (
                  'Enviar pruebas a revisión'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
