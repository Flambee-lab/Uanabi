import { Lightbulb, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'

const TIPS = [
  {
    icon: MessageCircle,
    title: 'Por qué validar tu WhatsApp',
    body: 'Es el canal directo sin fricción por el que las marcas cierran patrocinios. Un número verificado aumenta la tasa de respuesta.',
  },
  {
    icon: Sparkles,
    title: 'Cómo mejorar tu atractivo ante marcas',
    body: 'Completá métricas reales de Instagram y TikTok, y sumá colaboraciones con fotos de evidencia que demuestren resultados.',
  },
  {
    icon: ShieldCheck,
    title: 'Credibilidad que convierte',
    body: 'Los sponsors comparan hosts en segundos. Un perfil completo con portfolio visual reduce la fricción para invitarte.',
  },
]

export default function ProfileSuggestionsSidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border-subtle bg-white p-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <p className="text-sm font-bold text-foreground">Tips para un perfil de alto impacto</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          La información que cargás acá alimenta tu vista pública espejo — lo que ven las marcas antes
          de contactarte.
        </p>
      </div>

      {TIPS.map((tip) => (
        <div
          key={tip.title}
          className="rounded-2xl border border-border-subtle bg-white p-5"
        >
          <tip.icon className="mb-2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <p className="text-xs font-bold text-foreground">{tip.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
        </div>
      ))}
    </aside>
  )
}
