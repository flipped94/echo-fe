import JSEncrypt from 'jsencrypt'
const encryptor = new JSEncrypt()
export function encrypt(plaintext: string): string {
  encryptor.setPublicKey(
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCO/+9j9AzwTvnZDuyiJPReJxbcof/Vu41zVF3mTK2/WNMNGldnVHaMBeFlJK2Dl0R0ScbKGbgCfCefe6ZSF8FB/Fb8V9fv/vH/kICQ+grjY79HLrqerygiU1OaWHucbR4EAmO8cfBYc/TpUqiD9huPrtd1OMX4jPZyLgcr+3cgtwIDAQAB'
  )
  const res = encryptor.encrypt(plaintext)
  return res.toString()
}
