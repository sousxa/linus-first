import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { type AppData, emptyData, migrate } from '../types'
import { decodeSalt, decrypt, deriveKey, encrypt, randomSalt, type VaultBlob } from '../lib/vault'
import { loadSyncConfig, saveSyncConfig, pushToGist } from '../lib/sync'

const STORAGE_KEY = 'linus:vault'

export type VaultStatus = 'loading' | 'first' | 'locked' | 'unlocked'

interface VaultCtx {
  status: VaultStatus
  data: AppData | null
  error: string | null
  unlock: (password: string) => Promise<void>
  lock: () => void
  update: (updater: (d: AppData) => AppData) => void
  /** troca a senha: re-deriva a chave (novo salt) e re-cifra os dados */
  changePassword: (novaSenha: string) => Promise<void>
  /** apaga o cofre (esqueci a senha) — destrói os dados cifrados */
  reset: () => void
}

const Ctx = createContext<VaultCtx | null>(null)

function loadBlob(): VaultBlob | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as VaultBlob) : null
  } catch {
    return null
  }
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>('loading')
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const keyRef = useRef<CryptoKey | null>(null)
  const saltRef = useRef<Uint8Array | null>(null)
  const syncTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setStatus(loadBlob() ? 'locked' : 'first')
  }, [])

  // Persiste cifrado a cada mudança dos dados, reusando a chave já derivada (rápido).
  // Se o sync na nuvem estiver conectado, faz auto-push do blob cifrado com debounce.
  useEffect(() => {
    if (status !== 'unlocked' || !data || !keyRef.current || !saltRef.current) return
    let cancelled = false
    encrypt(keyRef.current, saltRef.current, JSON.stringify(data)).then((blob) => {
      if (cancelled) return
      const json = JSON.stringify(blob)
      localStorage.setItem(STORAGE_KEY, json)
      const cfg = loadSyncConfig()
      if (cfg?.token && cfg.gistId) {
        if (syncTimer.current) window.clearTimeout(syncTimer.current)
        syncTimer.current = window.setTimeout(() => {
          pushToGist(cfg.token, cfg.gistId, json)
            .then(() => saveSyncConfig({ ...cfg, lastSync: Date.now() }))
            .catch(() => {
              /* offline / token: ignora; o usuário ainda pode enviar manualmente */
            })
        }, 2500)
      }
    })
    return () => {
      cancelled = true
    }
  }, [data, status])

  const unlock = useCallback(async (password: string) => {
    setError(null)
    const blob = loadBlob()
    try {
      if (blob) {
        const salt = decodeSalt(blob)
        const key = await deriveKey(password, salt)
        const json = await decrypt(key, blob) // lança se a senha estiver errada
        keyRef.current = key
        saltRef.current = salt
        setData(migrate(JSON.parse(json)))
        setStatus('unlocked')
      } else {
        const salt = randomSalt()
        const key = await deriveKey(password, salt)
        keyRef.current = key
        saltRef.current = salt
        setData(emptyData())
        setStatus('unlocked')
      }
    } catch (e) {
      setError('Senha incorreta.')
      throw e
    }
  }, [])

  const lock = useCallback(() => {
    keyRef.current = null
    saltRef.current = null
    setData(null)
    setError(null)
    setStatus(loadBlob() ? 'locked' : 'first')
  }, [])

  const update = useCallback((updater: (d: AppData) => AppData) => {
    setData((prev) => (prev ? updater(prev) : prev))
  }, [])

  const changePassword = useCallback(async (novaSenha: string) => {
    const salt = randomSalt()
    const key = await deriveKey(novaSenha, salt)
    keyRef.current = key
    saltRef.current = salt
    // dispara o efeito de persistência, que re-cifra com a nova chave/salt
    setData((prev) => (prev ? { ...prev } : prev))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    keyRef.current = null
    saltRef.current = null
    setData(null)
    setError(null)
    setStatus('first')
  }, [])

  return (
    <Ctx.Provider value={{ status, data, error, unlock, lock, update, changePassword, reset }}>
      {children}
    </Ctx.Provider>
  )
}

export function useVault(): VaultCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useVault deve estar dentro de <VaultProvider>')
  return v
}

/** conveniência pras seções: garante dados não-nulos no estado unlocked */
export function useData(): { data: AppData; update: (u: (d: AppData) => AppData) => void } {
  const { data, update } = useVault()
  if (!data) throw new Error('useData só pode ser usado quando o cofre está aberto')
  return { data, update }
}
