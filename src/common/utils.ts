import * as crypto from 'crypto-js'

export const encryptCard = (card: any) => {
  return crypto.AES.encrypt(JSON.stringify(card), 'secret key 123').toString()
}

export const decryptCard = (cipherCard: string) => {
  const bytes = crypto.AES.decrypt(cipherCard, 'secret key 123')
  return JSON.parse(bytes.toString(crypto.enc.Utf8))
}
