import { describe, it, expect } from 'vitest'
import { addMonths, currentMonth } from './date'

describe('date — addMonths', () => {
  it('soma meses dentro do ano', () => {
    expect(addMonths('2026-06', 0)).toBe('2026-06')
    expect(addMonths('2026-06', 3)).toBe('2026-09')
  })

  it('vira o ano corretamente', () => {
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-11', 5)).toBe('2027-04')
  })

  it('aceita k negativo', () => {
    expect(addMonths('2026-01', -1)).toBe('2025-12')
  })

  it('não pula nem duplica meses (bug de fuso UTC)', () => {
    const seq = Array.from({ length: 6 }, (_, i) => addMonths('2026-06', i))
    expect(seq).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'])
    expect(new Set(seq).size).toBe(6)
  })

  it('currentMonth tem o formato YYYY-MM', () => {
    expect(currentMonth()).toMatch(/^\d{4}-\d{2}$/)
  })
})
