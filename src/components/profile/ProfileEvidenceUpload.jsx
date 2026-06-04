import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

function readFiles(fileList) {
  return Array.from(fileList).map((file) => ({
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
  }))
}

export default function ProfileEvidenceUpload({ photos = [], onChange, max = 6 }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = (fileList) => {
    if (!fileList?.length) return
    const next = [...photos, ...readFiles(fileList)].slice(0, max)
    onChange(next)
  }

  const removePhoto = (id) => {
    const removed = photos.find((p) => p.id === id)
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
    onChange(photos.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-center transition ${
          dragOver
            ? 'border-neutral-900 bg-neutral-50'
            : 'border-neutral-300 bg-white hover:border-neutral-900'
        }`}
      >
        <ImagePlus className="h-5 w-5 text-neutral-500" strokeWidth={1.75} />
        <p className="text-xs font-bold text-neutral-700">+ Añadir fotos de evidencia</p>
        <p className="text-[10px] text-neutral-400">Arrastrá imágenes o hacé clic para cargar</p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-100"
            >
              {photo.previewUrl ? (
                <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-100 p-2 text-center text-[9px] font-medium text-neutral-500">
                  {photo.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Quitar foto"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
