import { describe, it, expect } from 'vitest'
import { deriveKey, encrypt, decrypt, randomSalt, decodeSalt } from './vault'

describe('vault (criptografia local)', () => {
  it('faz roundtrip encrypt → decrypt com a senha certa', async () => {
    const salt = randomSalt()
    const key = await deriveKey('minha-senha-123', salt)
    const blob = await encrypt(key, salt, JSON.stringify({ ola: 'mundo', n: 42 }))
    const out = await decrypt(key, blob)
    expect(JSON.parse(out)).toEqual({ ola: 'mundo', n: 42 })
  })

  it('falha ao decifrar com a senha errada', async () => {
    const salt = randomSalt()
    const key = await deriveKey('certa', salt)
    const blob = await encrypt(key, salt, 'segredo')

    const wrongKey = await deriveKey('errada', decodeSalt(blob))
    await expect(decrypt(wrongKey, blob)).rejects.toBeTruthy()
  })

  it('usa IV diferente a cada gravação (ciphertext muda)', async () => {
    const salt = randomSalt()
    const key = await deriveKey('s', salt)
    const a = await encrypt(key, salt, 'mesmo texto')
    const b = await encrypt(key, salt, 'mesmo texto')
    expect(a.iv).not.toEqual(b.iv)
    expect(a.ct).not.toEqual(b.ct)
  })

  it('preserva o salt no blob pra rederivar no reload', async () => {
    const salt = randomSalt()
    const key = await deriveKey('s', salt)
    const blob = await encrypt(key, salt, 'x')
    expect(decodeSalt(blob)).toEqual(salt)
  })
})
