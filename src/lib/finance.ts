import type { CartaoCredito, Parcela, SaidaFixa } from '../types'

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

// --- Parcelas ---

/** quantas parcelas ainda faltam */
export function parcelaRestantes(p: Parcela): number {
  return Math.max(0, p.totalParcelas - p.parcelasPagas)
}

/** a parcela foi quitada? */
export function parcelaQuitada(p: Parcela): boolean {
  return p.parcelasPagas >= p.totalParcelas
}

/** valor que ainda falta pagar de uma parcela */
export function parcelaValorRestante(p: Parcela): number {
  return round2(parcelaRestantes(p) * p.valorParcela)
}

/** soma mensal das parcelas ainda não quitadas */
export function totalParcelasMensais(parcelas: Parcela[]): number {
  return round2(
    parcelas.filter((p) => !parcelaQuitada(p)).reduce((acc, p) => acc + p.valorParcela, 0),
  )
}

// --- Cartões de crédito ---

/** crédito ainda disponível em um cartão (limite - fatura) */
export function creditoDisponivel(c: CartaoCredito): number {
  return round2(c.limite - c.faturaAtual)
}

/** soma das faturas atuais de todos os cartões */
export function totalFaturas(cartoes: CartaoCredito[]): number {
  return round2(cartoes.reduce((acc, c) => acc + c.faturaAtual, 0))
}

/** soma do crédito disponível em todos os cartões */
export function totalCreditoDisponivel(cartoes: CartaoCredito[]): number {
  return round2(cartoes.reduce((acc, c) => acc + creditoDisponivel(c), 0))
}
