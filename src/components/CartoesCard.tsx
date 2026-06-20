import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useData } from '../store/VaultContext'
import type { CartaoCredito } from '../types'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { MoneyInput } from './ui/MoneyInput'
import { Modal } from './ui/Modal'
import { IconPicker } from './ui/IconPicker'
import { Icon } from './ui/icons'
import { cn } from '../lib/cn'
import { formatBRL } from '../lib/format'
import { uid } from '../lib/id'
import {
  creditoDisponivel,
  totalCreditoDisponivel,
  gastoMensalDoCartao,
  fixasDoCartao,
  parcelasDoCartao,
} from '../lib/finance'

export function CartoesCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const [open, setOpen] = useState(false)

  function patch(id: string, p: Partial<CartaoCredito>) {
    update((d) => ({
      ...d,
      cartoes: d.cartoes.map((c) => (c.id === id ? { ...c, ...p } : c)),
    }))
  }

  function remover(id: string) {
    update((d) => ({ ...d, cartoes: d.cartoes.filter((c) => c.id !== id) }))
  }

  return (
    <Card
      title="Cartões de crédito"
      icon={<Icon name="credit-card" size={14} />}
      className={className}
      action={
        <span className="tnum text-xs text-muted">
          {formatBRL(totalCreditoDisponivel(data.cartoes))} livre
        </span>
      }
    >
      <ul className="space-y-3">
        {data.cartoes.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
            Nenhum cartão ainda.
          </li>
        )}
        {data.cartoes.map((c) => {
          const disp = creditoDisponivel(c)
          const atrelado = gastoMensalDoCartao(data, c.id)
          const qtd = fixasDoCartao(data.saidasFixas, c.id).length + parcelasDoCartao(data.parcelas, c.id).length
          return (
            <li key={c.id} className="rounded-xl border border-border bg-surface-2 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold">
                  <Icon name={c.icone || 'credit-card'} size={18} className="shrink-0" />
                  {c.nome}
                </p>
                <button
                  onClick={() => remover(c.id)}
                  aria-label="Remover"
                  className="px-1 text-muted transition hover:text-bad"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MoneyInput label="Limite" value={c.limite} onValue={(n) => patch(c.id, { limite: n })} />
                <MoneyInput
                  label="Fatura atual"
                  value={c.faturaAtual}
                  onValue={(n) => patch(c.id, { faturaAtual: n })}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                Disponível:{' '}
                <span className={cn('tnum font-semibold', disp >= 0 ? 'text-good' : 'text-bad')}>
                  {formatBRL(disp)}
                </span>
              </p>
              {qtd > 0 && (
                <p className="mt-1 text-xs text-muted">
                  {qtd} {qtd === 1 ? 'item atrelado' : 'itens atrelados'} ·{' '}
                  <span className="tnum text-text">{formatBRL(atrelado)}/mês</span>
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <Button variant="subtle" onClick={() => setOpen(true)} className="mt-3 w-full">
        <Plus size={16} /> Adicionar cartão
      </Button>

      {open && <AddCartaoForm onClose={() => setOpen(false)} />}
    </Card>
  )
}

function AddCartaoForm({ onClose }: { onClose: () => void }) {
  const { update } = useData()
  const [nome, setNome] = useState('')
  const [limite, setLimite] = useState(0)
  const [icone, setIcone] = useState('')

  const valido = nome.trim().length > 0 && limite > 0

  function add() {
    if (!valido) return
    update((d) => ({
      ...d,
      cartoes: [
        ...d.cartoes,
        {
          id: uid(),
          nome: nome.trim(),
          limite,
          faturaAtual: 0,
          diaVencimento: 10,
          icone: icone || undefined,
        },
      ],
    }))
    onClose()
  }

  return (
    <Modal title="Novo cartão" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <IconPicker value={icone} onChange={setIcone} />
        <Field
          label="Nome do cartão"
          placeholder="Nubank, Inter…"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="col-span-2">
          <MoneyInput label="Limite" value={limite} onValue={setLimite} />
        </div>
        <p className="col-span-2 -mt-1 text-xs text-muted">
          A fatura você atualiza depois, direto no cartão.
        </p>
        <Button onClick={add} disabled={!valido} className="col-span-2">
          Adicionar
        </Button>
      </div>
    </Modal>
  )
}
