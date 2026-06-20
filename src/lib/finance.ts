import type { SaidaFixa } from '../types'

/** arredonda pra 2 casas evitando ruído de ponto flutuante */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** soma mensal de todas as saídas fixas */
export function totalSaidasFixas(saidas: SaidaFixa[]): number {
  return round2(saidas.reduce((acc, s) => acc + s.valor, 0))
}

/** uma saída fixa está paga no mês informado? */
export function fixaPaga(s: SaidaFixa, mes: string): boolean {
  return s.pagasPorMes.includes(mes)
}

/** quanto ainda falta pagar de saídas fixas no mês */
export function totalFixasPendentes(saidas: SaidaFixa[], mes: string): number {
  return round2(saidas.filter((s) => !fixaPaga(s, mes)).reduce((acc, s) => acc + s.valor, 0))
}
