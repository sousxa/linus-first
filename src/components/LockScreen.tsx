import { useState, type FormEvent } from 'react'
import { useVault } from '../store/VaultContext'
import { Button } from './ui/Button'

export function LockScreen() {
  const { status, unlock, error, reset } = useVault()
  const first = status === 'first'
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [localErr, setLocalErr] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLocalErr(null)
    if (first && pw.length < 4) {
      setLocalErr('Use ao menos 4 caracteres.')
      return
    }
    if (first && pw !== confirm) {
      setLocalErr('As senhas não conferem.')
      return
    }
    setBusy(true)
    try {
      await unlock(pw)
    } catch {
      // erro de senha incorreta vem do contexto
    } finally {
      setBusy(false)
      setPw('')
      setConfirm('')
    }
  }

  function forgot() {
    const ok = window.confirm(
      'Sem a senha não dá pra recuperar os dados (eles são criptografados).\n\nApagar tudo e começar de novo?',
    )
    if (ok) reset()
  }

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-2xl">
            🔐
          </div>
          <h2 className="text-lg font-bold">{first ? 'Criar uma senha' : 'Desbloquear'}</h2>
          <p className="mt-1 text-xs text-muted">
            {first
              ? 'Ela criptografa seus dados neste navegador. Não é salva em lugar nenhum — guarde bem, não dá pra recuperar.'
              : 'Digite a senha pra abrir seu painel.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoFocus
            autoComplete={first ? 'new-password' : 'current-password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          {first && (
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar senha"
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          )}

          {(localErr || error) && (
            <p className="text-xs font-medium text-bad">{localErr ?? error}</p>
          )}

          <Button type="submit" disabled={busy || !pw} className="w-full">
            {busy ? 'Abrindo…' : first ? 'Criar e entrar' : 'Entrar'}
          </Button>
        </form>

        {!first && (
          <button
            onClick={forgot}
            className="mt-3 w-full text-center text-[11px] text-muted underline-offset-2 hover:underline"
          >
            Esqueci a senha (apagar tudo)
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        🔒 Criptografia AES-GCM · nada sai do seu navegador
      </p>
    </div>
  )
}
