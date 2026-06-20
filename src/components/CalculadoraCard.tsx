import { useMemo, useState } from 'react'
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
  const [alvo, setAlvo] = useState<string>('debito') // 'debito' ou id do cartão
  const [descricao, setDescricao] = useState('')

  const contaTipo = alvo === 'debito' ? 'debito' : 'credito'
  const cartaoId = alvo === 'debito' ? undefined : alvo

  const sim = useMemo(
    () => simularGasto(data, valor, contaTipo, cartaoId),
    [data, valor, contaTipo, cartaoId],
  )

  function registrar(direcao: 'entrada' | 'saida') {
    if (valor <= 0) return
    const t: Transacao = {
      id: uid(),
      data: new Date().toISOString().slice(0, 10),
      descricao: descricao.trim() || (direcao === 'saida' ? 'Gasto' : 'Entrada'),
      valor,
      direcao,
      contaTipo,
      cartaoId,
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
    <Card title="Calculadora — e se eu gastar?" icon="🧮" className={className}>
      <div className="grid gap-2 sm:grid-cols-2">
        <MoneyInput label="Quanto" value={valor} onValue={setValor} />
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Onde</span>
          <select
            value={alvo}
            onChange={(e) => setAlvo(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="debito">Débito (conta)</option>
            {data.cartoes.map((c) => (
              <option key={c.id} value={c.id}>
                Crédito · {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={cn(
          'mt-3 rounded-xl border p-3',
          sim.estouro ? 'border-bad bg-bad/10' : 'border-border bg-surface-2',
        )}
      >
        <p className="text-xs text-muted">
          {sim.rotulo} depois de gastar {formatBRL(valor)}:
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="tnum text-sm text-muted line-through">{formatBRL(sim.antes)}</span>
          <span aria-hidden className="text-muted">
            →
          </span>
          <span
            className={cn('tnum text-2xl font-bold', sim.depois < 0 ? 'text-bad' : 'text-good')}
          >
            {formatBRL(sim.depois)}
          </span>
        </p>
        {sim.estouro && (
          <p className="mt-1 text-xs font-medium text-bad">
            ⚠️ Vai ficar no negativo — melhor não gastar tudo isso.
          </p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <Field
          label="Descrição (opcional)"
          placeholder="Mercado, uber…"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary" onClick={() => registrar('saida')} disabled={valor <= 0}>
            − Registrar saída
          </Button>
          <Button variant="ghost" onClick={() => registrar('entrada')} disabled={valor <= 0}>
            + Registrar entrada
          </Button>
        </div>
        <p className="text-[11px] text-muted">
          “Registrar” atualiza seu saldo/fatura. A simulação acima é só uma prévia.
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
                  className="text-[11px] text-muted hover:underline"
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
