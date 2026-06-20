import type { AppData, CartaoCredito, Parcela, SaidaFixa, Transacao } from '../types'
import { addMonths, currentMonth } from './date'

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

// --- Calculadora "e se eu gastar" e lançamentos ---

export interface Simulacao {
  rotulo: string
  antes: number
  depois: number
  /** ficou negativo (estourou saldo ou limite) */
  estouro: boolean
}

/** simula um gasto sem aplicá-lo: mostra o saldo/crédito antes e depois */
export function simularGasto(
  d: AppData,
  valor: number,
  contaTipo: 'debito' | 'credito',
  cartaoId?: string,
): Simulacao {
  if (contaTipo === 'debito') {
    const depois = round2(d.saldoDebito - valor)
    return { rotulo: 'Saldo no débito', antes: d.saldoDebito, depois, estouro: depois < 0 }
  }
  const cartao = d.cartoes.find((c) => c.id === cartaoId)
  if (!cartao) return { rotulo: 'Crédito', antes: 0, depois: 0, estouro: false }
  const antes = creditoDisponivel(cartao)
  const depois = round2(antes - valor)
  return { rotulo: `Crédito em ${cartao.nome}`, antes, depois, estouro: depois < 0 }
}

/** aplica uma transação avulsa nos saldos (débito) ou na fatura (crédito) */
export function aplicarTransacao(d: AppData, t: Transacao): AppData {
  const sinal = t.direcao === 'entrada' ? 1 : -1
  if (t.contaTipo === 'debito') {
    return { ...d, saldoDebito: round2(d.saldoDebito + sinal * t.valor) }
  }
  // crédito: saída (compra) aumenta a fatura; entrada (pagamento) diminui
  return {
    ...d,
    cartoes: d.cartoes.map((c) =>
      c.id === t.cartaoId ? { ...c, faturaAtual: round2(c.faturaAtual - sinal * t.valor) } : c,
    ),
  }
}

/** desfaz uma transação aplicada anteriormente */
export function reverterTransacao(d: AppData, t: Transacao): AppData {
  return aplicarTransacao(d, {
    ...t,
    direcao: t.direcao === 'entrada' ? 'saida' : 'entrada',
  })
}

// --- Previsibilidade (projeção mês a mês) ---

export type StatusMes = 'safe' | 'apertado' | 'perigo'

export interface MesProjecao {
  mes: string
  entradas: number
  saidas: number
  saldoInicio: number
  saldoFim: number
  status: StatusMes
}

/** classifica o mês: vermelho se negativo, amarelo se apertado, verde se folgado */
export function statusDoSaldo(saldoFim: number, renda: number): StatusMes {
  if (saldoFim < 0) return 'perigo'
  if (renda > 0 ? saldoFim < renda * 0.5 : saldoFim === 0) return 'apertado'
  return 'safe'
}

/**
 * Projeta o saldo dos próximos n meses.
 * Mês 0 considera o que ainda falta pagar (fixas pendentes + faturas atuais);
 * meses seguintes usam o total fixo recorrente. Parcelas entram nos seus meses restantes.
 */
export function projetarMeses(d: AppData, n = 6): MesProjecao[] {
  const fixasTotal = totalSaidasFixas(d.saidasFixas)
  const base = currentMonth()
  const out: MesProjecao[] = []
  let saldo = d.saldoDebito

  for (let i = 0; i < n; i++) {
    const mes = addMonths(base, i)
    const entradas = d.renda.mensal
    const fixas = i === 0 ? totalFixasPendentes(d.saidasFixas, mes) : fixasTotal
    const parcelas = d.parcelas.reduce(
      (acc, p) => acc + (i < parcelaRestantes(p) ? p.valorParcela : 0),
      0,
    )
    const faturas = i === 0 ? totalFaturas(d.cartoes) : 0
    const saidas = fixas + parcelas + faturas
    const saldoInicio = saldo
    saldo = saldoInicio + entradas - saidas
    out.push({
      mes,
      entradas,
      saidas,
      saldoInicio,
      saldoFim: saldo,
      status: statusDoSaldo(saldo, entradas),
    })
  }
  return out
}
