// Sync na nuvem do COFRE CIFRADO via Gist privado do próprio GitHub do usuário.
// Zero backend: o navegador fala direto com a API do GitHub (CORS ok). O conteúdo é o blob
// já criptografado (AES-GCM) — ninguém lê sem a senha. O token só vive no localStorage do device.

const GIST_FILE = 'linus-first.vault.json'
const API = 'https://api.github.com'
const CFG_KEY = 'linus:sync'

export interface SyncConfig {
  token: string
  gistId?: string
  lastSync?: number
}

export function loadSyncConfig(): SyncConfig | null {
  try {
    const raw = localStorage.getItem(CFG_KEY)
    return raw ? (JSON.parse(raw) as SyncConfig) : null
  } catch {
    return null
  }
}

export function saveSyncConfig(cfg: SyncConfig | null): void {
  if (!cfg || !cfg.token) localStorage.removeItem(CFG_KEY)
  else localStorage.setItem(CFG_KEY, JSON.stringify(cfg))
}

async function ghFetch(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    throw new Error(
      res.status === 401 || res.status === 403
        ? 'Token inválido ou sem permissão (precisa do escopo gist).'
        : `Erro do GitHub (${res.status}).`,
    )
  }
  return res
}

/** cria (POST) ou atualiza (PATCH) o gist privado com o blob cifrado; retorna o gistId */
export async function pushToGist(
  token: string,
  gistId: string | undefined,
  blobJson: string,
): Promise<string> {
  const body = JSON.stringify({
    description: 'linus-first vault (cifrado)',
    public: false,
    files: { [GIST_FILE]: { content: blobJson } },
  })
  const res = gistId
    ? await ghFetch(token, `/gists/${gistId}`, { method: 'PATCH', body })
    : await ghFetch(token, '/gists', { method: 'POST', body })
  const data = await res.json()
  return data.id as string
}

/** baixa o blob cifrado do gist */
export async function pullFromGist(token: string, gistId: string): Promise<string> {
  const res = await ghFetch(token, `/gists/${gistId}`)
  const data = await res.json()
  const file = data.files?.[GIST_FILE]
  if (!file) throw new Error('Esse gist não tem o cofre do linus-first.')
  if (file.truncated && file.raw_url) {
    const raw = await fetch(file.raw_url)
    return raw.text()
  }
  return file.content as string
}

/** procura um gist existente que já tenha o cofre (pra reconectar sem decorar o id) */
export async function findVaultGist(token: string): Promise<string | undefined> {
  const res = await ghFetch(token, '/gists?per_page=100')
  const list = (await res.json()) as Array<{ id: string; files?: Record<string, unknown> }>
  const found = list.find((g) => g.files && GIST_FILE in g.files)
  return found?.id
}
