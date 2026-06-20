import { useMemo, useState } from 'react'
import { Calculator, Landmark, CreditCard, Minus, Plus } from 'lucide-react'
import { useData } from '../store/VaultContext'
import type { Transacao } from '../types'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { MoneyInput } from './ui/MoneyInput'
import { cn } from '../lib/cn'
import { formatBRL } from '../lib/format'
import { uid } from '../lib/id'
import { simularGasto, aplicarTransacao, reverterTransacao } from '../lib/finance'

export function CalculadoraCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const [valor, setValor] = useState(0)
  const [tipo, setTipo] = useState<'debito' | 'credito'>('debito')
  const [cartaoId, setCartaoId] = useState<string>(data.cartoes[0]?.id ?? '')
  const [descricao, setDescricao] = useState('')

  const semCartao = tipo === 'credito' && data.cartoes.length === 0
  const cartaoOk = tipo === 'debito' || (!!cartaoId && data.cartoes.some((c) => c.id === cartaoId))
  const podeRegistrar = valor > 0 && cartaoOk && !semCartao

  const sim = useMemo(
    () => simularGasto(data, valor, tipo, tipo === 'credito' ? cartaoId : undefined),
    [data, valor, tipo, cartaoId],
  )

  function registrar(direcao: 'entrada' | 'saida') {
    if (!podeRegistrar) return
    const t: Transacao = {
      id: uid(),
      data: new Date().toISOString().slice(0, 10),
      descricao: descricao.trim() || (direcao === 'saida' ? 'Gasto' : 'Entrada'),
      valor,
      direcao,
      contaTipo: tipo,
      cartaoId: tipo === 'credito' ? cartaoId : undefined,
      mesRef: data.mesAtual,
    }
    update((d) => {
      const nd = aplicarTransacao(d, t)
      return { ...nd, transacoes: [t, ...nd.transacoes].slice(0, 50) }
    })
    setValor(0)
    setDescricao('')
  }

  function desfazer(t: Transacao) {
    update((d) => {
      const nd = reverterTransacao(d, t)
      return { ...nd, transacoes: nd.transacoes.filter((x) => x.id !== t.id) }
    })
  }

  const recentes = data.transacoes.slice(0, 5)

  return (
    <Card title="Lançar / e se eu gastar?" icon={<Calculator size={14} />} className={className}>
      <MoneyInput label="Quanto" value={valor} onValue={setValor} />

      {/* onde: débito ou crédito */}
      <div className="mt-3">
        <span className="mb-1 block text-sm font-medium text-muted">Onde</span>
        <div className="grid grid-cols-2 gap-2">
          <SegBtn active={tipo === 'debito'} onClick={() => setTipo('debito')} icon={Landmark} label="Débito" />
          <SegBtn active={tipo === 'credito'} onClick={() => setTipo('credito')} icon={CreditCard} label="Crédito" />
        </div>
      </div>

      {tipo === 'credito' &&
        (semCartao ? (
          <p className="mt-2 text-sm text-muted">Cadastre um cartão primeiro pra lançar no crédito.</p>
        ) : (
          <select
            value={cartaoId}
            onChange={(e) => setCartaoId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 focus:border-primary focus:outline-none"
          >
            {data.cartoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        ))}

      {/* simulação (prévia) */}
      <div
        className={cn(
          'mt-3 rounded-xl border p-3',
          sim.estouro ? 'border-bad bg-bad/10' : 'border-border bg-surface-2',
        )}
      >
        <p className="text-xs text-muted">
          Simulação · {sim.rotulo} depois de {formatBRL(valor)}:
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="tnum text-sm text-muted line-through">{formatBRL(sim.antes)}</span>
          <span aria-hidden className="text-muted">
            →
          </span>
          <span className={cn('tnum text-2xl font-bold', sim.depois < 0 ? 'text-bad' : 'text-good')}>
            {formatBRL(sim.depois)}
          </span>
        </p>
        {sim.estouro && <p className="mt-1 text-xs font-medium text-bad">⚠️ Vai ficar no negativo.</p>}
      </div>

      {/* registrar de verdade */}
      <div className="mt-3 space-y-2">
        <Field
          label="Descrição (opcional)"
          placeholder="Mercado, uber…"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => registrar('saida')} disabled={!podeRegistrar}>
            <Minus size={16} /> Saída
          </Button>
          <Button variant="ghost" onClick={() => registrar('entrada')} disabled={!podeRegistrar}>
            <Plus size={16} /> Entrada
          </Button>
        </div>
        <p className="text-xs text-muted">
          A simulação é só prévia. “Saída/Entrada” registra e atualiza seu saldo/fatura.
        </p>
      </div>

      {recentes.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Últimos lançamentos
          </p>
          <ul className="space-y-1.5">
            {recentes.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    'tnum w-24 shrink-0 font-semibold',
                    t.direcao === 'entrada' ? 'text-good' : 'text-bad',
                  )}
                >
                  {t.direcao === 'entrada' ? '+' : '−'}
                  {formatBRL(t.valor)}
                </span>
                <span className="min-w-0 flex-1 truncate text-muted">
                  {t.descricao} · {t.contaTipo === 'debito' ? 'débito' : 'crédito'}
                </span>
                <button
                  onClick={() => desfazer(t)}
                  className="text-xs text-muted hover:underline"
                >
                  desfazer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

function SegBtn({
  active,
  onClick,
  icon: IconCmp,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Landmark
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition',
        active ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted hover:bg-surface-2',
      )}
    >
      <IconCmp size={16} />
      {label}
    </button>
  )
}
