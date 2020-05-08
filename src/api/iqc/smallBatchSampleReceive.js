import request from '@/utils/request'

// 接收
export function receive(params) {
  return request({
    url: '/zlSample/receive',
    method: 'put',
    params
  })
}
