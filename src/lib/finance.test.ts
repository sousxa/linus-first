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
} from './finance'
import type { Parcela, SaidaFixa } from '../types'

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
