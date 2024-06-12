import { post } from '@/utils/axios'

export function getVerifyCode(scene: string) {
  return post<null>({
    url: `/mail/code/${scene}`
  })
}
