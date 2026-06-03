import { filterByAdmissionRules, getProposalRubro, matchesAdmissionRules } from './gatekeeperFilters'

export function filterEventProposals(events, rules) {
  return events.map((event) => ({
    ...event,
    proposalsReceived: filterByAdmissionRules(event.proposalsReceived ?? [], rules),
  }))
}

export function countHiddenProposalsInEvents(events, rules) {
  let total = 0
  let visible = 0

  events.forEach((event) => {
    const all = event.proposalsReceived ?? []
    total += all.length
    visible += filterByAdmissionRules(all, rules).length
  })

  return total - visible
}

export function countAllProposals(events) {
  return events.reduce((sum, e) => sum + (e.proposalsReceived?.length ?? 0), 0)
}

export function countPendingProposals(events) {
  return events.reduce(
    (sum, e) =>
      sum + (e.proposalsReceived?.filter((p) => p.status === 'pendiente').length ?? 0),
    0,
  )
}

export { getProposalRubro, matchesAdmissionRules }
