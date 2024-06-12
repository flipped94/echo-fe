import { get, post } from '@/utils/axios'

import type { Interact } from '@/types/interact'

export function incrReadCount(biz: string, bizId: string) {
  return post<null>({
    url: '/interact/incr-read',
    data: {
      biz: biz,
      bizId: bizId
    }
  })
}

export function getInteract(biz: string, bizId: string, userId: number | null) {
  return get<Interact>({
    url: '/interact/get',
    data: {
      biz: biz,
      bizId: bizId,
      userId: userId
    }
  })
}

export function like(biz: string, bizId: string) {
  return post<null>({
    url: '/interact/like',
    data: {
      biz: biz,
      bizId: bizId
    }
  })
}

export function cancelLike(biz: string, bizId: string) {
  return post<null>({
    url: '/interact/cancel-like',
    data: {
      biz: biz,
      bizId: bizId
    }
  })
}

export function collect(biz: string, bizId: string) {
  return post<null>({
    url: '/interact/collect',
    data: {
      biz: biz,
      bizId: bizId
    }
  })
}

export function cancleCollect(biz: string, bizId: string) {
  return post<null>({
    url: '/interact/cancel-collect',
    data: {
      biz: biz,
      bizId: bizId
    }
  })
}
