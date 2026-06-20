/** mês atual no formato YYYY-MM (no fuso local) */
export function currentMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * soma k meses a um YYYY-MM.
 * Aritmética pura de mês — sem `new Date(...)`, que parseia em UTC e, em fusos
 * negativos (ex: Brasília, UTC-3), retornava o mês anterior (meses pulados/duplicados).
 */
export function addMonths(ym: string, k: number): string {
  const [y, m] = ym.split('-').map(Number)
  const total = y * 12 + (m - 1) + k
  const ny = Math.floor(total / 12)
  const nm = total - ny * 12 + 1 // sempre 1..12, inclusive pra k negativo
  return `${ny}-${String(nm).padStart(2, '0')}`
}
