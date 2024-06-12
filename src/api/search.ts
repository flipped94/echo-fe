import type { SearchParams } from '@/types/search'
import { get } from '../utils/axios'

export function search(param: SearchParams) {
  return get<any[]>({
    url: '/search',
    data: param
  })
}
