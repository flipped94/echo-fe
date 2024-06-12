import { post } from '@/utils/axios'

export function upload(formData: FormData) {
  return post<string>({
    url: '/oss/upload/webook-oss',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
