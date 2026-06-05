import { useState } from 'react'
import { X } from 'lucide-react'
import Input from '../ui/Input'
import { isEventPast } from '../../utils/sponsorshipLifecycle'

export default function EventEditModal({ event, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: event.title ?? '',
    date: event.date ?? '',
    time: event.time ?? '',
    venueName: event.venueName ?? '',
    venueAddress: event.venueAddress ?? event.location ?? '',
    description: event.description ?? '',
  })

  if (!isOpen) return null

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEventPast(event)) return
    onSave?.({
      ...event,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      venueName: form.venueName.trim(),
      venueAddress: form.venueAddress.trim(),
      location: form.venueAddress.trim() || form.venueName.trim(),
      description: form.description.trim(),
    })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-subtle bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Editar información
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground/80">Título</label>
            <Input
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-foreground/80">Fecha</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => update({ date: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-foreground/80">Horario</label>
              <Input
                value={form.time}
                onChange={(e) => update({ time: e.target.value })}
                placeholder="19:00 – 23:00"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground/80">Lugar</label>
            <Input
              value={form.venueName}
              onChange={(e) => update({ venueName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground/80">Dirección</label>
            <Input
              value={form.venueAddress}
              onChange={(e) => update({ venueAddress: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground/80">
              Descripción breve
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
