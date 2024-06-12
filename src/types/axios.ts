export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface PageResult<T> {
  total: number
  data: T[]
}

export interface Response<T = any> {
  code: string
  data: T
  message: string
}
