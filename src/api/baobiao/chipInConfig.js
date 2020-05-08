import request from '@/utils/request'

// 列表
export function selectFp(params) {
  return request({
    url: '/xpIncomingTest/selectFp',
    method: 'get',
    params
  })
}
// 列表
export function selectYp(params) {
  return request({
    url: '/xpIncomingTest/selectYp',
    method: 'get',
    params
  })
}
