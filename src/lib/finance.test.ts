import { describe, it, expect } from 'vitest'
import { round2, totalSaidasFixas, totalFixasPendentes, fixaPaga } from './finance'
import type { SaidaFixa } from '../types'

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
