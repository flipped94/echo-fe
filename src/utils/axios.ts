import axios, { type AxiosResponse } from 'axios'

import type { Response, HttpOption } from '../types/axios'

import { useTokenStore } from '@/stores/token'

const baseUrl = 'http://localhost:8079'

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    // 获取token
    const accessToken = tokenStore.accessToken
    const refreshToken = tokenStore.refreshToken
    // 添加token
    config.headers['X-Echo-AccessToken'] = accessToken
    config.headers['X-Echo-RefreshToken'] = refreshToken
    return config
  },
  (error) => {
    // 请求出错
    return Promise.reject(error)
  }
)

// 定义返回数据类型的泛型 T，默认值是 any
function http<T = any>({ url, data, method, headers, beforeRequest, afterRequest }: HttpOption) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    // if (res.data.code === '200') {
    //   return res.data
    // }
    // throw new Error(res.data.msg || '请求失败，未知异常')
    return res.data
  }
  const failHandler = (error: Response<Error>) => {
    afterRequest && afterRequest()
    throw new Error(error.message || '请求失败，未知异常')
  }
  beforeRequest && beforeRequest()
  method = method || 'GET'
  const params = Object.assign(typeof data === 'function' ? data() : data || {}, {})
  return method === 'GET'
    ? instance.get(url, { params }).then(successHandler, failHandler)
    : instance.post(url, params, { headers: headers }).then(successHandler, failHandler)
}

// 定义返回数据类型的泛型 T，默认值是 any
export function get<T = any>({
  url,
  data,
  method = 'GET',
  beforeRequest,
  afterRequest
}: HttpOption): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    beforeRequest,
    afterRequest
  })
}

// 定义返回数据类型的泛型 T，默认值是 any
export function post<T = any>({
  url,
  data,
  method = 'POST',
  headers,
  beforeRequest,
  afterRequest
}: HttpOption): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    beforeRequest,
    afterRequest
  })
}
