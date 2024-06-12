import type { Article, ArticleAbstract, ArticleForCreate } from '@/types/article'
import type { PageResult } from '@/types/axios'
import { get, post } from '@/utils/axios'

export function publish(article: ArticleForCreate) {
  return post<string>({
    url: '/articles/publish',
    data: article
  })
}

export function save(article: ArticleForCreate) {
  return post<string>({
    url: '/articles/save',
    data: article
  })
}

export function getArticleById(id: string) {
  return get<Article>({
    url: `/articles/pub/${id}`
  })
}

export function readerPubList(page: number, pageSize: number) {
  return get<PageResult<ArticleAbstract>>({
    url: '/articles/pub/list',
    data: {
      page,
      pageSize
    }
  })
}
