import { Lightbulb, Link2, MessageCircle, Sparkles } from 'lucide-react'

const TIPS = [
  {
    icon: Link2,
    title: 'Verificá Instagram y TikTok',
    body: 'Conectá cada cuenta desde Redes sociales. Si cambiás el @usuario, hay que volver a verificar — así evitamos perfiles ajenos.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp comercial',
    body: 'Es el canal directo por el que las marcas cierran patrocinios. Mantenelo actualizado.',
  },
  {
    icon: Sparkles,
    title: 'Contenido destacado',
    body: 'El grid de tu perfil se alimenta de las redes conectadas. Conectá IG/TikTok para mostrar seguidores reales.',
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
