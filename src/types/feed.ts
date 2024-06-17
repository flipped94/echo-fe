export interface Feed {
  id: string
  type: string
  createTime: number
  ext: Record<string, string>
}

export interface FeedEventRequest {
  limit: number
  timestamp: number
}
