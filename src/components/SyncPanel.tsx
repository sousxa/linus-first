import { useState } from 'react'
import { Button } from './ui/Button'
import {
  loadSyncConfig,
  saveSyncConfig,
  pushToGist,
  pullFromGist,
  findVaultGist,
  type SyncConfig,
} from '../lib/sync'

const VAULT_KEY = 'linus:vault'

export function SyncPanel({ onClose }: { onClose: () => void }) {
  const [cfg, setCfg] = useState<SyncConfig | null>(loadSyncConfig())
  const [token, setToken] = useState(cfg?.token ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const conectado = !!cfg?.token

  async function conectar() {
    setErr(null)
    setMsg(null)
    if (!token.trim()) return
    setBusy(true)
    try {
      const gistId = await findVaultGist(token.trim())
      const nc: SyncConfig = { token: token.trim(), gistId }
      saveSyncConfig(nc)
      setCfg(nc)
      setMsg(
        gistId
          ? 'Conectado — achei seu cofre na nuvem. Use "Trazer" pra puxar.'
          : 'Conectado — ainda sem cofre na nuvem. Use "Enviar" pra criar.',
      )
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Falha ao conectar.')
    } finally {
      setBusy(false)
    }
  }

  async function enviar() {
    setErr(null)
    setMsg(null)
    if (!cfg?.token) return
    setBusy(true)
    try {
      const blob = localStorage.getItem(VAULT_KEY)
      if (!blob) throw new Error('Nada pra enviar ainda — adicione algum dado primeiro.')
      const gistId = await pushToGist(cfg.token, cfg.gistId, blob)
      const nc: SyncConfig = { ...cfg, gistId, lastSync: Date.now() }
      saveSyncConfig(nc)
      setCfg(nc)
      setMsg('Enviado pra nuvem ✓')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Falha ao enviar.')
    } finally {
      setBusy(false)
    }
  }

  async function trazer() {
    setErr(null)
    setMsg(null)
    if (!cfg?.token || !cfg.gistId) {
      setErr('Conecte e tenha um cofre na nuvem primeiro.')
      return
    }
    const ok = window.confirm(
      'Isso substitui os dados deste aparelho pelos da nuvem.\nVocê vai precisar digitar a senha de novo. Continuar?',
    )
    if (!ok) return
    setBusy(true)
    try {
      const blob = await pullFromGist(cfg.token, cfg.gistId)
      localStorage.setItem(VAULT_KEY, blob)
      saveSyncConfig({ ...cfg, lastSync: Date.now() })
      location.reload()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Falha ao trazer.')
      setBusy(false)
    }
  }

  function desconectar() {
    saveSyncConfig(null)
    setCfg(null)
    setToken('')
    setMsg('Desconectado deste aparelho (o cofre na nuvem continua lá).')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold">☁️ Sincronizar</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-muted hover:text-text">
            ✕
          </button>
        </div>

        <p className="mb-3 text-xs text-muted">
          Guarda o cofre <span className="text-text">cifrado</span> num Gist privado do seu GitHub pra
          usar no PC e no celular. Ninguém lê sem a sua senha.
        </p>

        {!conectado ? (
          <>
            <label className="mb-1 block text-xs font-medium text-muted">Token do GitHub (escopo gist)</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_…"
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <a
              href="https://github.com/settings/tokens/new?scopes=gist&description=linus-first"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-[11px] text-primary hover:underline"
            >
              Criar um token com escopo “gist” →
            </a>
            <Button onClick={conectar} disabled={busy || !token.trim()} className="mt-3 w-full">
              {busy ? 'Conectando…' : 'Conectar'}
            </Button>
          </>
        ) : (
          <div className="space-y-2">
            <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
              {cfg?.gistId ? 'Cofre na nuvem: conectado.' : 'Sem cofre na nuvem ainda — use “Enviar”.'}
              {cfg?.lastSync && (
                <div className="mt-1">Último sync: {new Date(cfg.lastSync).toLocaleString('pt-BR')}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={enviar} disabled={busy}>
                ⬆️ Enviar
              </Button>
              <Button variant="ghost" onClick={trazer} disabled={busy || !cfg?.gistId}>
                ⬇️ Trazer
              </Button>
            </div>
            <button onClick={desconectar} className="w-full pt-1 text-[11px] text-muted hover:underline">
              Desconectar este aparelho
            </button>
          </div>
        )}

        {msg && <p className="mt-3 text-xs font-medium text-good">{msg}</p>}
        {err && <p className="mt-3 text-xs font-medium text-bad">{err}</p>}
      </div>
    </div>
  )
}
