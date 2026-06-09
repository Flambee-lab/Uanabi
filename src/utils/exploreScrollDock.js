/** Progreso 0→1 del search hero → navbar (estilo Airbnb). */
export const EXPLORE_SEARCH_DOCK_START = 20
export const EXPLORE_SEARCH_DOCK_END = 150

export function exploreSearchDockProgress(scrollTop) {
  const range = EXPLORE_SEARCH_DOCK_END - EXPLORE_SEARCH_DOCK_START
  if (range <= 0) return scrollTop >= EXPLORE_SEARCH_DOCK_END ? 1 : 0
  return Math.min(1, Math.max(0, (scrollTop - EXPLORE_SEARCH_DOCK_START) / range))
}
