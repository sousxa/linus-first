import { useMemo, useState } from 'react'
import { useData } from '../store/VaultContext'
import type { StatusMes } from '../lib/finance'
import { projetarMeses } from '../lib/finance'
import { Card } from './ui/Card'
import { cn } from '../lib/cn'
import { formatBRL, monthLabel } from '../lib/format'

const tone: Record<StatusMes, { box: string; value: string; dot: string; rotulo: string }> = {
  safe: { box: 'border-good/40 bg-good/10', value: 'text-good', dot: 'bg-good', rotulo: 'sobra' },
  apertado: {
    box: 'border-border bg-surface-2',
    value: 'text-text',
    dot: 'bg-muted',
    rotulo: 'apertado',
  },
  perigo: { box: 'border-bad/50 bg-bad/10', value: 'text-bad', dot: 'bg-bad', rotulo: 'no vermelho' },
}

export function ForecastTable({ className }: { className?: string }) {
  const { data } = useData()
  const [meses, setMeses] = useState(6)
  const proj = useMemo(() => projetarMeses(data, meses), [data, meses])

  return (
    <Card
      title="Previsão dos próximos meses"
      icon="📅"
      className={className}
      action={
        <div className="flex gap-1">
          {[6, 12].map((n) => (
            <button
              key={n}
              onClick={() => setMeses(n)}
              className={cn(
                'rounded-lg px-2 py-1 text-xs font-semibold transition',
                meses === n ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
              )}
            >
              {n}m
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {proj.map((m) => {
          const t = tone[m.status]
          return (
            <div key={m.mes} className={cn('rounded-xl border p-3', t.box)}>
              <p className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted">
                {monthLabel(m.mes)}
                {m.status === 'perigo' && <span aria-label="no vermelho">⚠️</span>}
              </p>
              <p className={cn('tnum mt-1 text-lg font-bold', t.value)}>{formatBRL(m.saldoFim)}</p>
              <p className="mt-1 text-[10px] text-muted">
                +{formatBRL(m.entradas)} · −{formatBRL(m.saidas)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
        {(['safe', 'apertado', 'perigo'] as StatusMes[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', tone[s].dot)} />
            {tone[s].rotulo}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Considera saldo atual + renda − saídas fixas, parcelas e faturas. Use pra saber até onde dá
        pra gastar.
      </p>
    </Card>
  )
}
