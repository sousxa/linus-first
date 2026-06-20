import { CalendarDays } from 'lucide-react'
import { useData } from '../store/VaultContext'
import { cn } from '../lib/cn'
import { formatBRL, monthLabel } from '../lib/format'
import { round2, totalSaidasFixas, totalParcelasMensais } from '../lib/finance'

export function SummaryBar() {
  const { data } = useData()
  const fixas = totalSaidasFixas(data.saidasFixas)
  const parcelas = totalParcelasMensais(data.parcelas)
  const sobra = round2(data.renda.mensal - fixas - parcelas)

  const stats: { label: string; value: number; tone?: 'good' | 'bad' }[] = [
    { label: 'Saldo em conta', value: data.saldoDebito, tone: data.saldoDebito >= 0 ? 'good' : 'bad' },
    { label: 'Renda / mês', value: data.renda.mensal },
    { label: 'Fixas + parcelas', value: round2(fixas + parcelas) },
    { label: 'Sobra por mês', value: sobra, tone: sobra >= 0 ? 'good' : 'bad' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <CalendarDays size={14} />
        Mês de {monthLabel(data.mesAtual)}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p
              className={cn(
                'tnum mt-0.5 text-lg font-bold',
                s.tone === 'good' && 'text-good',
                s.tone === 'bad' && 'text-bad',
              )}
            >
              {formatBRL(s.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
