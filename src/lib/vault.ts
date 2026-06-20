// Criptografia local com WebCrypto.
// - Chave AES-GCM 256 derivada da senha via PBKDF2 (SHA-256, 150k iterações, salt aleatório).
// - A senha NUNCA é salva; só vive o tempo de derivar a chave (que fica em memória).
// - Cada gravação usa um IV novo. O salt é guardado junto do ciphertext pra rederivar no reload.
// - Senha errada faz o decrypt lançar (auth tag do GCM), sem vazar dados.

const ITERATIONS = 150_000
const KEY_LENGTH = 256

export interface VaultBlob {
  v: 1
  salt: string // base64
  iv: string // base64
  ct: string // base64 (ciphertext + auth tag)
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function randomSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export function decodeSalt(blob: VaultBlob): Uint8Array {
  return b64ToBytes(blob.salt)
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password) as BufferSource,
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encrypt(key: CryptoKey, salt: Uint8Array, plaintext: string): Promise<VaultBlob> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext) as BufferSource,
  )
  return {
    v: 1,
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    ct: bytesToB64(new Uint8Array(ct)),
  }
}

export async function decrypt(key: CryptoKey, blob: VaultBlob): Promise<string> {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBytes(blob.iv) as BufferSource },
    key,
    b64ToBytes(blob.ct) as BufferSource,
  )
  return new TextDecoder().decode(plain)
}
