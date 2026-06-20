import { useState } from 'react'
import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { MoneyInput } from './ui/MoneyInput'
import { IconPicker } from './ui/IconPicker'
import { Icon } from './ui/icons'
import { ContaSelect, contaFromValue } from './ui/ContaSelect'
import { ContaTag } from './ui/ContaTag'
import { cn } from '../lib/cn'
import { formatBRL } from '../lib/format'
import { currentMonth } from '../lib/date'
import { uid } from '../lib/id'
import {
  parcelaRestantes,
  parcelaQuitada,
  parcelaValorRestante,
  totalParcelasMensais,
} from '../lib/finance'

export function ParcelasCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0)
  const [total, setTotal] = useState(12)
  const [mesInicio, setMesInicio] = useState(currentMonth())
  const [icone, setIcone] = useState('')
  const [conta, setConta] = useState('debito')

  function add() {
    if (!nome.trim() || valor <= 0 || total < 1) return
    update((d) => ({
      ...d,
      parcelas: [
        ...d.parcelas,
        {
          id: uid(),
          nome: nome.trim(),
          valorParcela: valor,
          totalParcelas: total,
          parcelasPagas: 0,
          mesInicio,
          icone: icone || undefined,
          ...contaFromValue(conta),
        },
      ],
    }))
    setNome('')
    setValor(0)
    setTotal(12)
    setIcone('')
    setConta('debito')
  }

  function pagar(id: string, delta: number) {
    update((d) => ({
      ...d,
      parcelas: d.parcelas.map((p) =>
        p.id === id
          ? { ...p, parcelasPagas: Math.min(p.totalParcelas, Math.max(0, p.parcelasPagas + delta)) }
          : p,
      ),
    }))
  }

  function remover(id: string) {
    update((d) => ({ ...d, parcelas: d.parcelas.filter((p) => p.id !== id) }))
  }

  return (
    <Card
      title="Parcelas"
      icon="🧾"
      className={className}
      action={
        <span className="tnum text-xs text-muted">
          {formatBRL(totalParcelasMensais(data.parcelas))}/mês
        </span>
      }
    >
      <ul className="space-y-2">
        {data.parcelas.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-3 text-center text-sm text-muted">
            Nenhuma parcela. Cadastre compras parceladas pra ver o contador.
          </li>
        )}
        {data.parcelas.map((p) => {
          const quitada = parcelaQuitada(p)
          const pct = Math.round((p.parcelasPagas / p.totalParcelas) * 100)
          return (
            <li key={p.id} className="rounded-xl border border-border bg-surface-2 p-2.5">
              <div className="flex items-center gap-2">
                {p.icone && <Icon name={p.icone} size={20} className="shrink-0 text-muted" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.nome}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted">
                    {formatBRL(p.valorParcela)} · faltam{' '}
                    {parcelaValorRestante(p) > 0 ? formatBRL(parcelaValorRestante(p)) : 'nada'}
                    <ContaTag item={p} />
                  </p>
                </div>
                <span
                  className={cn(
                    'tnum rounded-lg px-2 py-0.5 text-xs font-semibold',
                    quitada ? 'bg-good/20 text-good' : 'bg-surface text-text',
                  )}
                >
                  {p.parcelasPagas}/{p.totalParcelas}
                </span>
                <button
                  onClick={() => remover(p.id)}
                  aria-label="Remover"
                  className="px-1 text-muted transition hover:text-bad"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className={cn('h-full rounded-full transition-all', quitada ? 'bg-good' : 'bg-primary')}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-2 flex items-center gap-2">
                {quitada ? (
                  <span className="text-xs font-medium text-good">✓ Quitada</span>
                ) : (
                  <Button variant="subtle" onClick={() => pagar(p.id, +1)} className="px-2 py-1 text-xs">
                    Paguei +1 ({parcelaRestantes(p)} restantes)
                  </Button>
                )}
                {p.parcelasPagas > 0 && (
                  <button
                    onClick={() => pagar(p.id, -1)}
                    className="text-[11px] text-muted hover:underline"
                  >
                    desfazer
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
        <IconPicker value={icone} onChange={setIcone} />
        <Field
          label="O que parcelou"
          placeholder="Celular, geladeira…"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <MoneyInput label="Valor da parcela" value={valor} onValue={setValor} />
        <Field
          label="Nº de parcelas"
          type="number"
          min={1}
          max={360}
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
        />
        <Field
          label="Mês de início"
          type="month"
          value={mesInicio}
          onChange={(e) => setMesInicio(e.target.value)}
        />
        <div className="col-span-2">
          <ContaSelect value={conta} onChange={setConta} />
        </div>
        <Button
          onClick={add}
          disabled={!nome.trim() || valor <= 0 || total < 1}
          className="col-span-2"
        >
          + Adicionar parcela
        </Button>
      </div>
    </Card>
  )
}
