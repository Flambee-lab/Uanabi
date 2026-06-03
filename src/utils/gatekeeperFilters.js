export function mapIndustryToRubro(industry) {
  const map = {
    Bebidas: 'Bebidas',
    Tecnología: 'Gaming & Tech',
    Indumentaria: 'Moda & Diseño',
    Gastronomía: 'Gastronomía',
    Entretenimiento: 'Entretenimiento',
  }
  return map[industry] ?? industry
}

export function getProposalRubro(proposal) {
  return proposal.rubro ?? mapIndustryToRubro(proposal.industry)
}

export function matchesAdmissionRules(proposal, rules) {
  const rubro = getProposalRubro(proposal)

  if (rules.allowedRubros?.length > 0 && !rules.allowedRubros.includes(rubro)) {
    return false
  }

  if (rules.onlyCashBudget) {
    const hasCash =
      proposal.budgetType === 'Presupuesto Efectivo' || proposal.budgetType === 'Híbrido'
    if (!hasCash) return false
  }

  if (rules.onlyLogistics) {
    const hasLogistics = proposal.budgetType === 'Canje' || proposal.budgetType === 'Híbrido'
    if (!hasLogistics) return false
  }

  return true
}

export function filterByAdmissionRules(proposals, rules) {
  const hasActiveRules =
    (rules.allowedRubros?.length ?? 0) > 0 || rules.onlyCashBudget || rules.onlyLogistics

  if (!hasActiveRules) return proposals

  return proposals.filter((proposal) => matchesAdmissionRules(proposal, rules))
}

export function countHiddenByRules(proposals, rules, filtered) {
  return proposals.length - filtered.length
}
