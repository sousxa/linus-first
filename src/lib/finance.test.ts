import { describe, it, expect } from 'vitest'
import {
  round2,
  totalSaidasFixas,
  totalFixasPendentes,
  fixaPaga,
  parcelaRestantes,
  parcelaQuitada,
  parcelaValorRestante,
  totalParcelasMensais,
  creditoDisponivel,
  totalFaturas,
  totalCreditoDisponivel,
  simularGasto,
  aplicarTransacao,
  reverterTransacao,
  projetarMeses,
  statusDoSaldo,
} from './finance'
import { emptyData, type CartaoCredito, type Parcela, type SaidaFixa, type Transacao } from '../types'
import { addMonths, currentMonth } from './date'

const mkCartao = (over: Partial<CartaoCredito>): CartaoCredito => ({
  id: Math.random().toString(),
  nome: 'cartão',
  limite: 1000,
  faturaAtual: 0,
  diaVencimento: 10,
  ...over,
})

const mkParcela = (over: Partial<Parcela>): Parcela => ({
  id: Math.random().toString(),
  nome: 'compra',
  valorParcela: 100,
  totalParcelas: 12,
  parcelasPagas: 0,
  mesInicio: '2026-06',
  ...over,
})

const mk = (over: Partial<SaidaFixa>): SaidaFixa => ({
  id: Math.random().toString(),
  nome: 'x',
  valor: 0,
  diaVencimento: 5,
  pagasPorMes: [],
  ...over,
})

describe('finance — base', () => {
  it('round2 corrige ruído de ponto flutuante', () => {
    expect(round2(0.1 + 0.2)).toBe(0.3)
    expect(round2(2.675)).toBe(2.68)
  })
})

describe('finance — saídas fixas', () => {
  const saidas = [mk({ valor: 49.9 }), mk({ valor: 120 }), mk({ valor: 0.1 })]

  it('soma o total mensal', () => {
    expect(totalSaidasFixas(saidas)).toBe(170)
  })

  it('fixaPaga checa o mês', () => {
    const s = mk({ pagasPorMes: ['2026-06'] })
    expect(fixaPaga(s, '2026-06')).toBe(true)
    expect(fixaPaga(s, '2026-07')).toBe(false)
  })

  it('total pendente ignora as já pagas no mês', () => {
    const s = [mk({ valor: 100, pagasPorMes: ['2026-06'] }), mk({ valor: 30 })]
    expect(totalFixasPendentes(s, '2026-06')).toBe(30)
    expect(totalFixasPendentes(s, '2026-07')).toBe(130)
  })
})

describe('finance — parcelas', () => {
  it('conta as parcelas restantes (3/12 → 9)', () => {
    expect(parcelaRestantes(mkParcela({ parcelasPagas: 3, totalParcelas: 12 }))).toBe(9)
  })

  it('marca como quitada quando pagas >= total', () => {
    expect(parcelaQuitada(mkParcela({ parcelasPagas: 12, totalParcelas: 12 }))).toBe(true)
    expect(parcelaQuitada(mkParcela({ parcelasPagas: 11, totalParcelas: 12 }))).toBe(false)
  })

  it('calcula o valor restante', () => {
    expect(parcelaValorRestante(mkParcela({ valorParcela: 99.9, parcelasPagas: 10, totalParcelas: 12 }))).toBe(199.8)
  })

  it('soma mensal ignora parcelas quitadas', () => {
    const ps = [
      mkParcela({ valorParcela: 200, parcelasPagas: 12, totalParcelas: 12 }), // quitada
      mkParcela({ valorParcela: 150, parcelasPagas: 2, totalParcelas: 10 }),
    ]
    expect(totalParcelasMensais(ps)).toBe(150)
  })
})

describe('finance — cartões', () => {
  it('crédito disponível = limite - fatura', () => {
    expect(creditoDisponivel(mkCartao({ limite: 1000, faturaAtual: 350 }))).toBe(650)
  })

  it('crédito disponível pode ser negativo (estourou o limite)', () => {
    expect(creditoDisponivel(mkCartao({ limite: 500, faturaAtual: 600 }))).toBe(-100)
  })

  it('soma faturas e crédito disponível de vários cartões', () => {
    const cs = [
      mkCartao({ limite: 1000, faturaAtual: 200 }),
      mkCartao({ limite: 2000, faturaAtual: 500 }),
    ]
    expect(totalFaturas(cs)).toBe(700)
    expect(totalCreditoDisponivel(cs)).toBe(2300)
  })
})

describe('finance — calculadora e lançamentos', () => {
  it('simula gasto no débito (antes/depois e estouro)', () => {
    const d = { ...emptyData(), saldoDebito: 100 }
    expect(simularGasto(d, 30, 'debito')).toMatchObject({ antes: 100, depois: 70, estouro: false })
    expect(simularGasto(d, 150, 'debito').estouro).toBe(true)
  })

  it('simula gasto no crédito usando o disponível do cartão', () => {
    const card = mkCartao({ id: 'c1', limite: 500, faturaAtual: 100 })
    const d = { ...emptyData(), cartoes: [card] }
    const sim = simularGasto(d, 200, 'credito', 'c1')
    expect(sim).toMatchObject({ antes: 400, depois: 200, estouro: false })
    expect(simularGasto(d, 500, 'credito', 'c1').estouro).toBe(true)
  })

  it('aplica e reverte transação no débito', () => {
    const d = { ...emptyData(), saldoDebito: 100 }
    const t: Transacao = {
      id: 't1',
      data: '2026-06-20',
      descricao: 'mercado',
      valor: 40,
      direcao: 'saida',
      contaTipo: 'debito',
    }
    const aplicado = aplicarTransacao(d, t)
    expect(aplicado.saldoDebito).toBe(60)
    expect(reverterTransacao(aplicado, t).saldoDebito).toBe(100)
  })

  it('saída no crédito aumenta a fatura; reverter desfaz', () => {
    const d = { ...emptyData(), cartoes: [mkCartao({ id: 'c1', faturaAtual: 100 })] }
    const t: Transacao = {
      id: 't2',
      data: '2026-06-20',
      descricao: 'compra',
      valor: 50,
      direcao: 'saida',
      contaTipo: 'credito',
      cartaoId: 'c1',
    }
    const aplicado = aplicarTransacao(d, t)
    expect(aplicado.cartoes[0].faturaAtual).toBe(150)
    expect(reverterTransacao(aplicado, t).cartoes[0].faturaAtual).toBe(100)
  })
})

describe('finance — previsibilidade', () => {
  it('statusDoSaldo classifica certo', () => {
    expect(statusDoSaldo(-10, 1000)).toBe('perigo')
    expect(statusDoSaldo(300, 1000)).toBe('apertado') // < metade da renda
    expect(statusDoSaldo(5000, 1000)).toBe('safe')
  })

  it('projeta exatamente n meses', () => {
    const d = { ...emptyData(), saldoDebito: 1000, renda: { mensal: 3000 } }
    expect(projetarMeses(d, 6)).toHaveLength(6)
    expect(projetarMeses(d, 12)).toHaveLength(12)
  })

  it('fica no vermelho quando as saídas superam saldo + renda', () => {
    const d = {
      ...emptyData(),
      saldoDebito: 0,
      renda: { mensal: 1000 },
      saidasFixas: [{ id: 'a', nome: 'aluguel', valor: 2000, diaVencimento: 5, pagasPorMes: [] }],
    }
    const p = projetarMeses(d, 3)
    expect(p[0].saldoFim).toBeLessThan(0)
    expect(p[0].status).toBe('perigo')
  })

  it('fica verde quando há folga', () => {
    const d = { ...emptyData(), saldoDebito: 10000, renda: { mensal: 5000 } }
    expect(projetarMeses(d, 1)[0].status).toBe('safe')
  })

  it('gera meses sequenciais e únicos (sem repetir por fuso)', () => {
    const meses = projetarMeses(emptyData(), 6).map((m) => m.mes)
    expect(new Set(meses).size).toBe(6)
    expect(meses[0]).toBe(currentMonth())
    expect(meses[1]).toBe(addMonths(currentMonth(), 1))
  })

  it('arredonda centavos no saldo projetado', () => {
    const d = { ...emptyData(), saldoDebito: 0.1, renda: { mensal: 0.2 } }
    // sem round2 daria 0.30000000000000004
    expect(projetarMeses(d, 1)[0].saldoFim).toBe(0.3)
  })
})
