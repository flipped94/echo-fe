import type { Author } from './author'

export interface Comment {
  id: string
  // 评论者
  author: Author
  // 评论对象
  biz: string
  bizId: string
  // 评论内容
  content: string
  replies: Reply[]
  totalReplies: number
  createTime: number
  updateTime: number

  readCount: number
  likeCount: number
  collectCount: number
  commentCount: number
  liked: boolean
  collected: boolean
}

export interface CommentForQuery {
  biz: string
  bizId: string
  minCommentId: string
  limit: number
}

export interface CommentForCreate {
  biz: string
  bizId: string
  content: string
  type: string
}

export interface Reply {
  id: string
  author: Author
  replyToId: string
  replyTo: Author
  // 评论或回复
  type: string
  content: string
  createTime: number
  updateTime: number

  likeCount: number
  liked: boolean
}
