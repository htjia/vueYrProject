import request from '@/utils/request'

// 列表
export function deleteAny(params) {
  return request({
    url: '/zlScrapTypeController/delete',
    method: 'delete',
    params
  })
}
// 列表
export function findList(params) {
  return request({
    url: '/zlScrapTypeController/find',
    method: 'get',
    params
  })
}
// 列表
export function disableEnable(params) {
  return request({
    url: '/zlScrapTypeController/disableEnable',
    method: 'post',
    params
  })
}
// 列表
export function save(params) {
  return request({
    url: '/zlScrapTypeController/save',
    method: 'post',
    data: params
  })
}
