export default function RecommendedBrandsEmptyState({ variant = 'exhausted' }) {
  if (variant === 'no-match') {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle px-6 py-16 text-center">
        <p className="type-body font-semibold text-foreground">
          No hay marcas recomendadas por ahora
        </p>
        <p className="type-small mx-auto mt-2 max-w-sm text-muted-foreground">
          No encontramos marcas que coincidan con el nicho o rubros de este evento. Editá el evento
          y ajustá las industrias que buscás para ampliar las opciones.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-dashed border-border-subtle px-6 py-16 text-center">
      <p className="type-body font-semibold text-foreground">
        Ya invitaste a todas las marcas recomendadas
      </p>
      <p className="type-small mx-auto mt-2 max-w-sm text-muted-foreground">
        Cuando haya nuevas coincidencias para tu evento, las vas a ver acá.
      </p>
    </div>
  )
}
