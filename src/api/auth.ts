import type { Token } from '@/types/token'
import { post } from '../utils/axios'

import type {
  AuthorForLogin,
  AuthorForRegister,
  AuthorForUpdateEmail,
  AuthorForUpdatePassword
} from '@/types/author'

export function login(author: AuthorForLogin) {
  return post<Token>({
    url: '/auth/login',
    data: author
  })
}

export function register(author: AuthorForRegister) {
  return post<Token>({
    url: '/auth/register',
    data: author
  })
}

export function updatePass(password: AuthorForUpdatePassword) {
  return post<null>({
    url: '/auth/update-pass',
    data: password
  })
}

export function updateEmail(email: AuthorForUpdateEmail) {
  return post<null>({
    url: '/auth/update-email',
    data: email
  })
}
