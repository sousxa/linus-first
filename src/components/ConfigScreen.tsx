import { useState } from 'react'
import { KeyRound, CalendarCheck, History, Cloud, Lock } from 'lucide-react'
import { useVault, useData } from '../store/VaultContext'
import { fecharMes } from '../lib/finance'
import { formatBRL, monthLabel } from '../lib/format'
import { addMonths } from '../lib/date'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { SyncPanel } from './SyncPanel'

export function ConfigScreen() {
  const { changePassword, lock } = useVault()
  const { data, update } = useData()
  const [syncOpen, setSyncOpen] = useState(false)

  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState<string | null>(null)
  const [pwErr, setPwErr] = useState<string | null>(null)
  const [pwBusy, setPwBusy] = useState(false)

  async function trocar() {
    setPwMsg(null)
    setPwErr(null)
    if (pw.length < 4) {
      setPwErr('Use ao menos 4 caracteres.')
      return
    }
    if (pw !== confirm) {
      setPwErr('As senhas não conferem.')
      return
    }
    setPwBusy(true)
    try {
      await changePassword(pw)
      setPw('')
      setConfirm('')
      setPwMsg('Senha trocada ✓')
    } catch {
      setPwErr('Não foi possível trocar a senha.')
    } finally {
      setPwBusy(false)
    }
  }

  function fechar() {
    const ok = window.confirm(
      `Fechar o mês de ${monthLabel(data.mesAtual)}?\nEle vai pro histórico e começa ${monthLabel(
        addMonths(data.mesAtual, 1),
      )} (os "pagos" zeram).`,
    )
    if (ok) update(fecharMes)
  }

  const inputCls =
    'w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 focus:border-primary focus:outline-none'

  return (
    <div className="space-y-4">
      <Card title="Trocar senha" icon={<KeyRound size={14} />}>
        <div className="space-y-2">
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Nova senha"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirmar nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
          />
          {pwErr && <p className="text-xs font-medium text-bad">{pwErr}</p>}
          {pwMsg && <p className="text-xs font-medium text-good">{pwMsg}</p>}
          <Button onClick={trocar} disabled={pwBusy || !pw} className="w-full">
            {pwBusy ? 'Trocando…' : 'Trocar senha'}
          </Button>
          <p className="text-xs text-muted">
            Re-cifra seus dados com a nova senha. Guarde bem — não dá pra recuperar.
          </p>
        </div>
      </Card>

      <Card title="Mês" icon={<CalendarCheck size={14} />}>
        <p className="text-sm text-muted">
          Mês ativo: <span className="font-semibold text-text">{monthLabel(data.mesAtual)}</span>
        </p>
        <Button onClick={fechar} className="mt-3 w-full">
          Fechar mês de {monthLabel(data.mesAtual)}
        </Button>
        <p className="mt-2 text-xs text-muted">
          Arquiva um resumo e começa o próximo mês limpo (os “pagos” zeram).
        </p>

        {data.arquivoMeses.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <History size={14} /> Histórico
            </p>
            <ul className="space-y-1.5">
              {data.arquivoMeses.map((m) => (
                <li
                  key={m.mes + m.fechadoEm}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="font-medium">{monthLabel(m.mes)}</span>
                  <span className="tnum text-xs text-muted">
                    saldo {formatBRL(m.saldoFinal)} · +{formatBRL(m.entradas)} / −{formatBRL(m.saidas)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card title="Conta & dispositivo" icon={<Cloud size={14} />}>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setSyncOpen(true)}>
            <Cloud size={16} /> Sincronizar
          </Button>
          <Button variant="ghost" onClick={lock}>
            <Lock size={16} /> Travar
          </Button>
        </div>
      </Card>

      {syncOpen && <SyncPanel onClose={() => setSyncOpen(false)} />}
    </div>
  )
}
