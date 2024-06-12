import { get, post } from '../utils/axios'

import type { Author, AuthorForUpdate } from '@/types/author'

export function profile() {
  return get<Author>({
    url: '/author/profile'
  })
}

export function edit(authorForUpdate: AuthorForUpdate) {
  return post<null>({
    url: '/author/edit',
    data: authorForUpdate
  })
}
