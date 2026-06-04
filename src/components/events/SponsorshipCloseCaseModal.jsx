import { useState } from 'react'
import { ImagePlus, Star, X } from 'lucide-react'

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

  if (!isOpen || !caseInfo) return null

  const reset = () => {
    setStep(1)
    setDelivered(null)
    setPhotos([])
    setRating(0)
    setReview('')
    setSuccess(false)
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
        previewUrl: URL.createObjectURL(file),
      })),
    ])
  }

  const handleFinalSubmit = () => {
    onSubmit?.({
      delivered,
      photos,
      rating,
      review,
      submittedAt: new Date().toISOString(),
    })
    setSuccess(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-[modal-enter_0.25s_ease-out] w-full max-w-lg rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-start justify-between border-b border-neutral-100 px-8 py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Paso {success ? '✓' : step} de 3
            </p>
            <h2 className="mt-1 font-display text-xl font-black tracking-tight text-neutral-900">
              {success
                ? 'Pruebas enviadas'
                : 'Finalizar Patrocinio y Validar Marcas'}
            </h2>
            {!success && (
              <p className="mt-1 text-xs text-neutral-500">
                {caseInfo.brandName} · {caseInfo.eventTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="px-8 py-8">
          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-sm leading-relaxed text-neutral-600">
                Recibimos tus pruebas. Onbrand verificará el caso en las próximas 24 horas para
                impactar las marcas en tu perfil público.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Entendido
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
              <p className="text-sm font-medium text-neutral-800">
                ¿La marca entregó los productos o el presupuesto acordado?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Sí', 'No'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDelivered(label === 'Sí')}
                    className={`rounded-2xl border py-4 text-sm font-bold transition ${
                      delivered === (label === 'Sí')
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-800">
                Subí evidencia visual del patrocinio
              </p>
              <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-neutral-200 p-8 text-center transition hover:border-neutral-400">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={photos.length >= MAX_PHOTOS}
                  onChange={(e) => {
                    addPhotos(e.target.files)
                    e.target.value = ''
                  }}
                />
                <ImagePlus className="mx-auto h-6 w-6 text-neutral-400" strokeWidth={1.75} />
                <p className="mt-3 text-xs font-bold text-neutral-700">
                  + Subir fotos del evento (Banners, stands o producto entregado)
                </p>
                <p className="mt-1 text-[10px] text-neutral-400">
                  Hasta {MAX_PHOTOS} fotos · {photos.length}/{MAX_PHOTOS}
                </p>
              </label>
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="h-16 w-16 overflow-hidden rounded-lg border border-neutral-100"
                    >
                      <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-medium text-neutral-800">
                Calificá tu experiencia con la marca
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="rounded-lg p-1 transition hover:bg-neutral-50"
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                rows={3}
                placeholder="Reseña interna sobre la marca (opcional)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          )}
        </div>

        {!success && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-8 py-6">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
              className="text-sm font-semibold text-neutral-400 hover:text-neutral-700"
            >
              {step > 1 ? 'Volver' : 'Cancelar'}
            </button>
            {step < 3 ? (
              <button
                type="button"
                disabled={step === 1 && delivered === null}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white disabled:opacity-40 hover:bg-neutral-800"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Enviar pruebas a revisión
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
