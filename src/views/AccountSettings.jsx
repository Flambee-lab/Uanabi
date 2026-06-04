import { useState } from 'react'
import { Shield } from 'lucide-react'
import DeleteAccountModal from '../components/settings/DeleteAccountModal'
import { DEFAULT_ACCOUNT_SETTINGS, isGoogleAuth } from '../data/accountSettings'

const INPUT_CLASS =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-0'

const EMAIL_READONLY_CLASS =
  'w-full flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-500 cursor-not-allowed'

function SettingsToggle({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
        enabled ? 'bg-neutral-900' : 'bg-neutral-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function CheckboxRow({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
      />
      <span className="text-xs leading-relaxed text-neutral-700">{label}</span>
    </label>
  )
}

export default function AccountSettings({
  settings: initialSettings = DEFAULT_ACCOUNT_SETTINGS,
  onSave,
  onDeleteAccount,
}) {
  const [settings, setSettings] = useState(initialSettings)
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [emailEditMode, setEmailEditMode] = useState(false)
  const [draftEmail, setDraftEmail] = useState(settings.email)

  const googleAuth = isGoogleAuth(settings)

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  const updateNotifications = (key, value) =>
    setSettings((prev) => ({
      ...prev,
      emailNotifications: { ...prev.emailNotifications, [key]: value },
    }))

  const handleSave = () => {
    onSave?.({
      ...settings,
      email: emailEditMode ? draftEmail : settings.email,
    })
    setEmailEditMode(false)
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const handleDelete = () => {
    setDeleteOpen(false)
    onDeleteAccount?.()
  }

  return (
    <div className="min-h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-2xl space-y-10 p-8">
        <header>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900">
            Account Settings
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            Administra las credenciales de tu cuenta, seguridad y canales de comunicación.
          </p>
        </header>

        {/* Sección 1: Seguridad */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-neutral-800">Credenciales de acceso</h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold text-neutral-700">
                Correo electrónico actual
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {emailEditMode ? (
                  <input
                    type="email"
                    className={INPUT_CLASS}
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    autoComplete="email"
                  />
                ) : (
                  <input
                    type="email"
                    readOnly
                    value={settings.email}
                    className={EMAIL_READONLY_CLASS}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (emailEditMode) {
                      update({ email: draftEmail.trim() })
                      setEmailEditMode(false)
                    } else {
                      setDraftEmail(settings.email)
                      setEmailEditMode(true)
                    }
                  }}
                  className="shrink-0 rounded-xl border border-neutral-200 px-4 py-3 text-xs font-bold text-neutral-800 transition hover:border-neutral-900"
                >
                  {emailEditMode ? 'Confirmar email' : 'Modificar Email'}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-neutral-400">
                {googleAuth
                  ? 'Los cambios de email se sincronizarán con Supabase Auth al guardar.'
                  : 'Recibirás un enlace de verificación en el correo nuevo (Supabase).'}
              </p>
            </div>

            {googleAuth ? (
              <div className="flex items-start gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-600">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" strokeWidth={1.75} />
                <p>
                  Tu cuenta está vinculada y protegida mediante Google Authentication.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-neutral-700">Cambio de contraseña</p>
                <input
                  type="password"
                  className={INPUT_CLASS}
                  placeholder="Contraseña actual"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  autoComplete="current-password"
                />
                <input
                  type="password"
                  className={INPUT_CLASS}
                  placeholder="Nueva contraseña"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  className={INPUT_CLASS}
                  placeholder="Confirmar contraseña"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
            )}

          </div>
        </section>

        {/* Sección 2: WhatsApp */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-neutral-800">Disponibilidad Comercial</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
            <div className="min-w-0 pr-4">
              <p className="text-xs font-semibold text-neutral-900">Recibir propuestas de marcas</p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
                Si desactivas esta opción, el botón de contacto en tu perfil público se ocultará
                temporalmente.
              </p>
            </div>
            <SettingsToggle
              enabled={settings.commercialContactEnabled}
              onChange={(val) => update({ commercialContactEnabled: val })}
              label="Recibir propuestas de marcas"
            />
          </div>
        </section>

        {/* Sección 3: Notificaciones */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-neutral-800">Notificaciones por correo</h2>
          <div className="space-y-3">
            <CheckboxRow
              checked={settings.emailNotifications.brandAcceptedProposal}
              onChange={(v) => updateNotifications('brandAcceptedProposal', v)}
              label="Avisarme cuando una marca acepte una propuesta de evento."
            />
            <CheckboxRow
              checked={settings.emailNotifications.caseClosureReminders}
              onChange={(v) => updateNotifications('caseClosureReminders', v)}
              label="Recordatorios de cierre de caso y carga de evidencias post-evento."
            />
          </div>
        </section>

        {/* Guardar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
          >
            Guardar cambios
          </button>
        </div>

        {/* Zona de peligro */}
        <section className="border-t border-neutral-100 pt-6">
          <h2 className="mb-2 text-sm font-bold text-red-600">Zona de peligro</h2>
          <p className="mb-4 text-[11px] text-neutral-400">
            Eliminá tu cuenta y todos los datos asociados en Onbrand de forma permanente.
          </p>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="text-xs font-semibold text-red-600 underline-offset-2 hover:text-red-700 hover:underline"
          >
            Eliminar mi cuenta definitivamente
          </button>
        </section>
      </div>

      <DeleteAccountModal
        isOpen={deleteOpen}
        email={settings.email}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
