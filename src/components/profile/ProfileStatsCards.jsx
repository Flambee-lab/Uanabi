export default function ProfileStatsCards({ stats }) {
  const cards = [
    { label: 'Matches Concretados', value: stats.matches },
    {
      label: 'Alcance Total Estimado',
      value:
        stats.totalReach >= 1000
          ? `${(stats.totalReach / 1000).toFixed(1)}k`
          : stats.totalReach,
    },
    ...(stats.engagement !== undefined
      ? [{ label: 'Engagement validado', value: stats.engagement }]
      : []),
    { label: 'Eventos Creados', value: stats.eventsCount },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-sm"
        >
          <p className="type-label ">
            {card.label}
          </p>
          <p className="mt-3 font-display text-3xl font-black tracking-tight text-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
