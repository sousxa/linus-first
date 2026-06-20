import { useState } from 'react'
import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { MoneyInput } from './ui/MoneyInput'
import { IconPicker } from './ui/IconPicker'
import { ContaSelect, contaFromValue } from './ui/ContaSelect'
import { ContaTag } from './ui/ContaTag'
import { cn } from '../lib/cn'
import { formatBRL } from '../lib/format'
import { currentMonth } from '../lib/date'
import { uid } from '../lib/id'
import { totalSaidasFixas, totalFixasPendentes, fixaPaga } from '../lib/finance'

export function SaidasFixasCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const mes = currentMonth()
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0)
  const [dia, setDia] = useState(5)
  const [icone, setIcone] = useState('')
  const [conta, setConta] = useState('debito')

  function add() {
    if (!nome.trim() || valor <= 0) return
    update((d) => ({
      ...d,
      saidasFixas: [
        ...d.saidasFixas,
        {
          id: uid(),
          nome: nome.trim(),
          valor,
          diaVencimento: dia,
          pagasPorMes: [],
          icone: icone || undefined,
          ...contaFromValue(conta),
        },
      ],
    }))
    setNome('')
    setValor(0)
    setDia(5)
    setIcone('')
    setConta('debito')
  }

  function togglePago(id: string) {
    update((d) => ({
      ...d,
      saidasFixas: d.saidasFixas.map((s) =>
        s.id === id
          ? {
              ...s,
              pagasPorMes: fixaPaga(s, mes)
                ? s.pagasPorMes.filter((m) => m !== mes)
                : [...s.pagasPorMes, mes],
            }
          : s,
      ),
    }))
  }

  function remover(id: string) {
    update((d) => ({ ...d, saidasFixas: d.saidasFixas.filter((s) => s.id !== id) }))
  }

  const pendente = totalFixasPendentes(data.saidasFixas, mes)

  return (
    <Card
      title="Saídas fixas"
      icon="🔁"
      className={className}
      action={
        <span className="tnum text-xs text-muted">
          {formatBRL(totalSaidasFixas(data.saidasFixas))}/mês
        </span>
      }
    >
      <ul className="space-y-2">
        {data.saidasFixas.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-3 text-center text-sm text-muted">
            Nenhuma saída fixa. Adicione assinaturas, aluguel, contas…
          </li>
        )}
        {data.saidasFixas.map((s) => {
          const pago = fixaPaga(s, mes)
          return (
            <li
              key={s.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-2"
            >
              <button
                onClick={() => togglePago(s.id)}
                aria-label={pago ? 'Desmarcar pago' : 'Marcar como pago'}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-sm transition',
                  pago ? 'border-good bg-good text-black' : 'border-border text-muted hover:border-good',
                )}
              >
                {pago ? '✓' : ''}
              </button>
              {s.icone && <span className="text-lg leading-none">{s.icone}</span>}
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', pago && 'text-muted line-through')}>
                  {s.nome}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted">
                  dia {s.diaVencimento}
                  <ContaTag item={s} />
                </p>
              </div>
              <span className="tnum text-sm font-semibold">{formatBRL(s.valor)}</span>
              <button
                onClick={() => remover(s.id)}
                aria-label="Remover"
                className="px-1 text-muted transition hover:text-bad"
              >
                ✕
              </button>
            </li>
          )
        })}
      </ul>

      {data.saidasFixas.length > 0 && (
        <p className="mt-2 text-xs text-muted">
          Falta pagar este mês:{' '}
          <span className="tnum font-semibold text-text">{formatBRL(pendente)}</span>
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
        <IconPicker value={icone} onChange={setIcone} />
        <Field
          label="Nome"
          placeholder="Netflix, aluguel…"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <MoneyInput label="Valor" value={valor} onValue={setValor} />
        <Field
          label="Dia venc."
          type="number"
          min={1}
          max={31}
          value={dia}
          onChange={(e) => setDia(Number(e.target.value))}
        />
        <div className="col-span-2">
          <ContaSelect value={conta} onChange={setConta} />
        </div>
        <Button onClick={add} disabled={!nome.trim() || valor <= 0} className="col-span-2">
          + Adicionar saída fixa
        </Button>
      </div>
    </Card>
  )
}
