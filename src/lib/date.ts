/** mês atual no formato YYYY-MM (no fuso local) */
export function currentMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** soma k meses a um YYYY-MM */
export function addMonths(ym: string, k: number): string {
  const dt = new Date(`${ym}-01`)
  dt.setMonth(dt.getMonth() + k)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}
