import { get, post } from '../utils/axios'

import type { Comment, CommentForCreate, CommentForQuery } from '@/types/comment'

export function addComment(comment: CommentForCreate) {
  return post<string>({
    url: '/comments/comment',
    data: comment
  })
}

export function getMoreComments(cond: CommentForQuery) {
  return get<Comment[]>({
    url: '/comments/more-comments',
    data: cond
  })
}
