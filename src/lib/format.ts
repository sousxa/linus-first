const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** formata um número como moeda brasileira (R$ 1.234,56) */
export function formatBRL(value: number): string {
  return brl.format(Number.isFinite(value) ? value : 0)
}

/**
 * interpreta texto digitado pelo usuário como número.
 * aceita "1.234,56", "1234,56" e "1234.56".
 */
export function parseMoney(raw: string): number {
  if (!raw) return 0
  const cleaned = raw.replace(/[^\d,.-]/g, '')
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // formato pt-BR: ponto é milhar, vírgula é decimal
    return Number(cleaned.replace(/\./g, '').replace(',', '.')) || 0
  }
  return Number(cleaned.replace(',', '.')) || 0
}

/** rótulo curto de um mês no formato YYYY-MM → "jun/26" */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  if (!y || !m) return ym
  return `${meses[m - 1]}/${String(y).slice(2)}`
}
