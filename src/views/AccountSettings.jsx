import { useState } from 'react'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldInput, FieldLabel } from '@/components/ui/form-field'
import { cn } from '@/lib/utils'
import DeleteAccountModal from '../components/settings/DeleteAccountModal'
import { DEFAULT_ACCOUNT_SETTINGS, isGoogleAuth } from '../data/accountSettings'

function SettingsToggle({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        enabled ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform duration-200',
          enabled ? 'translate-x-5' : 'translate-x-0',
        )}
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
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-foreground focus:ring-primary"
      />
      <span className="type-body text-foreground/80">{label}</span>
    </label>
  )
}

export default function AccountSettings({
  settings: initialSettings = DEFAULT_ACCOUNT_SETTINGS,
  onSave,
  onDeleteAccount,
  onRestartOnboarding,
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
  const [errors, setErrors] = useState({})

  const googleAuth = isGoogleAuth(settings)

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  const updateNotifications = (key, value) =>
    setSettings((prev) => ({
      ...prev,
      emailNotifications: { ...prev.emailNotifications, [key]: value },
    }))

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const handleConfirmEmail = () => {
    if (!isValidEmail(draftEmail)) {
      setErrors((prev) => ({ ...prev, email: 'Ingresá un email válido' }))
      return
    }
    setErrors((prev) => ({ ...prev, email: null }))
    update({ email: draftEmail.trim() })
    setEmailEditMode(false)
  }

  const handleSave = () => {
    const nextErrors = {}
    const nextEmail = emailEditMode ? draftEmail.trim() : settings.email
    if (emailEditMode && !isValidEmail(nextEmail)) {
      nextErrors.email = 'Ingresá un email válido antes de guardar'
    }
    const wantsPasswordChange =
      !googleAuth && (passwords.current || passwords.next || passwords.confirm)
    if (wantsPasswordChange) {
      if (passwords.next.length < 8) {
        nextErrors.password = 'La nueva contraseña debe tener al menos 8 caracteres'
      } else if (passwords.next !== passwords.confirm) {
        nextErrors.password = 'Las contraseñas no coinciden'
      }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave?.({ ...settings, email: nextEmail })
    setEmailEditMode(false)
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const handleDelete = () => {
    setDeleteOpen(false)
    onDeleteAccount?.()
  }

  return (
    <div className="uanabi-page overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-10 p-8 sm:p-10">
        <header>
          <h1 className="type-display">Configuración de cuenta</h1>
          <p className="type-small mt-2">
            Administrá las credenciales de tu cuenta, seguridad y canales de comunicación.
          </p>
        </header>

        <section>
          <h2 className="type-heading mb-4">Credenciales de acceso</h2>
          <div className="space-y-6">
            <div>
              <FieldLabel htmlFor="settings-email">Correo electrónico actual</FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {emailEditMode ? (
                  <FieldInput
                    id="settings-email"
                    type="email"
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    autoComplete="email"
                    className="flex-1"
                  />
                ) : (
                  <FieldInput
                    id="settings-email"
                    type="email"
                    readOnly
                    value={settings.email}
                    className="flex-1 cursor-not-allowed opacity-70"
                  />
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    if (emailEditMode) {
                      handleConfirmEmail()
                    } else {
                      setDraftEmail(settings.email)
                      setEmailEditMode(true)
                    }
                  }}
                >
                  {emailEditMode ? 'Confirmar email' : 'Modificar email'}
                </Button>
              </div>
              {errors.email && (
                <p className="type-small mt-2 text-destructive">{errors.email}</p>
              )}
              <p className="type-small mt-2">
                {googleAuth
                  ? 'Los cambios de email se sincronizarán con Supabase Auth al guardar.'
                  : 'Recibirás un enlace de verificación en el correo nuevo (Supabase).'}
              </p>
            </div>

            {googleAuth ? (
              <div className="flex items-start gap-2 rounded-2xl border border-border-subtle bg-secondary p-4">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <p className="type-body text-muted-foreground">
                  Tu cuenta está vinculada y protegida mediante Google Authentication.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="type-body font-semibold">Cambio de contraseña</p>
                <FieldInput
                  type="password"
                  placeholder="Contraseña actual"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  autoComplete="current-password"
                />
                <FieldInput
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  autoComplete="new-password"
                />
                <FieldInput
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="type-small text-destructive">{errors.password}</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="type-heading mb-4">Disponibilidad Comercial</h2>
          <div className="uanabi-panel flex items-center justify-between gap-4 p-4">
            <div className="min-w-0 pr-4">
              <p className="type-body font-semibold">Recibir propuestas de marcas</p>
              <p className="type-small mt-1">
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

        <section>
          <h2 className="type-heading mb-4">Notificaciones por correo</h2>
          <div className="uanabi-panel space-y-3 p-5">
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

        <div className="flex justify-end">
          <Button type="button" variant="primary" size="lg" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>

        {onRestartOnboarding && (
          <section className="border-t border-border-subtle pt-6">
            <h2 className="type-heading mb-2">Desarrollo</h2>
            <p className="type-small mb-4">
              Reiniciá el registro para volver a recorrer la bienvenida y los pasos del perfil.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRestartOnboarding}>
              Reiniciar onboarding
            </Button>
          </section>
        )}

        <section className="border-t border-border-subtle pt-6">
          <h2 className="type-heading mb-2 text-destructive">Zona de peligro</h2>
          <p className="type-small mb-4">
            Eliminá tu cuenta y todos los datos asociados en Uanabi de forma permanente.
          </p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Eliminar mi cuenta definitivamente
          </Button>
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
