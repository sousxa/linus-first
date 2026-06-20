import { describe, it, expect, vi, afterEach } from 'vitest'
import { pushToGist, pullFromGist, findVaultGist } from './sync'

type Resp = { ok: boolean; status: number; json?: () => Promise<unknown>; text?: () => Promise<string> }
function ok(json: unknown): Resp {
  return { ok: true, status: 200, json: async () => json, text: async () => JSON.stringify(json) }
}

afterEach(() => vi.restoreAllMocks())

describe('sync (gist cifrado)', () => {
  it('cria gist novo (POST) quando não há gistId e manda o token', async () => {
    const calls: { url: string; init: RequestInit }[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        calls.push({ url, init })
        return ok({ id: 'gid1' })
      }),
    )
    const id = await pushToGist('tok', undefined, '{"ct":"x"}')
    expect(id).toBe('gid1')
    expect(calls[0].url).toBe('https://api.github.com/gists')
    expect(calls[0].init.method).toBe('POST')
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBe('Bearer tok')
  })

  it('atualiza gist (PATCH) quando há gistId', async () => {
    const calls: { url: string; init: RequestInit }[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        calls.push({ url, init })
        return ok({ id: 'gid1' })
      }),
    )
    await pushToGist('tok', 'gid1', '{}')
    expect(calls[0].url).toBe('https://api.github.com/gists/gid1')
    expect(calls[0].init.method).toBe('PATCH')
  })

  it('pull retorna o conteúdo do arquivo do cofre', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ok({ files: { 'linus-first.vault.json': { content: 'BLOB' } } })))
    expect(await pullFromGist('tok', 'gid1')).toBe('BLOB')
  })

  it('encontra um gist existente com o cofre', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ok([{ id: 'x', files: {} }, { id: 'y', files: { 'linus-first.vault.json': {} } }])),
    )
    expect(await findVaultGist('tok')).toBe('y')
  })

  it('lança erro amigável em 401', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 401 }) as Resp))
    await expect(pullFromGist('bad', 'g')).rejects.toThrow(/escopo gist/)
  })
})
