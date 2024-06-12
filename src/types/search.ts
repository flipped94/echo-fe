import type { ArticleAbstract } from './article'

export interface SearchResult {
  articles: ArticleAbstract[]
}

export interface SearchParams {
  q: string
  type: string
  page: number
  limit: number
}
