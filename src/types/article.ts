import type { Author } from './author'

export interface ArticleForCreate {
  id: string | null
  cover: String
  title: string
  abstraction: string | null
  content: string
  tags: string[]
}

export interface ArticleAbstract {
  id: string
  title: string
  cover: string
  abstraction: string
  collectCount: number
  likeCount: number
  commentCount: number
  readCount: number
  liked: boolean
  collected: boolean
  createTime: number
  updateTime: number
  tags: string[]
  author: Author
}

export interface Article {
  id: string
  title: string
  cover: string
  content: string
  collectCount: number
  likeCount: number
  commentCount: number
  readCount: number
  liked: boolean
  collected: boolean
  createTime: number
  updateTime: number
  author: Author
}
