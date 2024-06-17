import { get } from '../utils/axios'
import type { Feed, FeedEventRequest } from '@/types/feed'

export function findFeedEvents(request: FeedEventRequest) {
  return get<Feed[]>({
    url: 'feed',
    data: request
  })
}
