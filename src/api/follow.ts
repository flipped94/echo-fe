import type { FollowRelation } from '@/types/follow'
import { get } from '@/utils/axios'

export function getFolloInfo(follower: string, followee: string) {
  return get<FollowRelation>({
    url: '/follow/follow-info',
    data: {
      follower: follower,
      followee: followee
    }
  })
}

export function follow(followee: string) {
  return get<null>({
    url: `/follow/${followee}`
  })
}

export function cancelFollow(followee: string) {
  return get<null>({
    url: `/follow/cancel/${followee}`
  })
}
