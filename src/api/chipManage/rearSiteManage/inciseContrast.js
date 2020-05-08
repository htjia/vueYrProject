import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/scProduceTask/find',
    method: 'get',
    params
  })
}
