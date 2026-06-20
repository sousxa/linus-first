import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { MoneyInput } from './ui/MoneyInput'
import { Modal } from './ui/Modal'
import { IconPicker } from './ui/IconPicker'
import { Icon } from './ui/icons'
import { ContaSelect, contaFromValue } from './ui/ContaSelect'
import { ContaTag } from './ui/ContaTag'
import { cn } from '../lib/cn'
import { formatBRL } from '../lib/format'
import { currentMonth } from '../lib/date'
import { uid } from '../lib/id'
import { totalSaidasFixas, totalFixasPendentes, fixaPaga } from '../lib/finance'

export function SaidasFixasCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const mes = data.mesAtual ?? currentMonth()
  const [open, setOpen] = useState(false)

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
      icon={<Icon name="receipt" size={14} />}
      className={className}
      action={
        <span className="tnum text-xs text-muted">
          {formatBRL(totalSaidasFixas(data.saidasFixas))}/mês
        </span>
      }
    >
      <ul className="space-y-2">
        {data.saidasFixas.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
            Nenhuma saída fixa ainda.
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
              {s.icone && <Icon name={s.icone} size={20} className="shrink-0 text-muted" />}
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', pago && 'text-muted line-through')}>
                  {s.nome}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
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

      <Button variant="subtle" onClick={() => setOpen(true)} className="mt-3 w-full">
        <Plus size={16} /> Adicionar saída fixa
      </Button>

      {open && <AddSaidaFixaForm onClose={() => setOpen(false)} />}
    </Card>
  )
}

function AddSaidaFixaForm({ onClose }: { onClose: () => void }) {
  const { update } = useData()
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0)
  const [dia, setDia] = useState(5)
  const [icone, setIcone] = useState('')
  const [conta, setConta] = useState('debito')

  const valido = nome.trim().length > 0 && valor > 0 && dia >= 1 && dia <= 31

  function add() {
    if (!valido) return
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
    onClose()
  }

  return (
    <Modal title="Nova saída fixa" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
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
        <Button onClick={add} disabled={!valido} className="col-span-2">
          Adicionar
        </Button>
      </div>
    </Modal>
  )
}
