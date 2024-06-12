import { get } from '../utils/axios'
import type { Feed } from '@/types/feed'

export function findFeedEvents(uid: string, limit: number, timestamp: number) {
  return get<Feed[]>({
    url: 'feed',
    data: {
      limit: limit,
      timestamp: timestamp
    }
  })
}
