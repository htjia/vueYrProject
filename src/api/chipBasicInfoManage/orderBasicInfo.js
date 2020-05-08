import request from '@/utils/request'

// 列表
export function findList(params) {
  return request({
    url: '/xpCustomer/pageList',
    method: 'get',
    params
  })
}
// 列表
export function insert(params) {
  return request({
    url: '/xpCustomer/insert',
    method: 'post',
    data: params
  })
}
// 列表
export function deletes(params) {
  return request({
    url: `/xpCustomer/${params.id}/delete`,
    method: 'delete'
  })
}
