import CryptoJS from 'crypto-js'

const KEY = 'assignment-secret-key' // for demo only

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, KEY).toString()
}

export function decrypt(cipher: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}
