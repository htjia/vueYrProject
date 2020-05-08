import request from '@/utils/request'

// 列表
export function selectAll() {
  return request({
    url: '/xpExceptionClassificationConfiguration/selectAll',
    method: 'get'
  })
}
// 列表
export function adds(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/add',
    method: 'post',
    data: params
  })
}
// 列表
export function deletes(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/delete',
    method: 'delete',
    params
  })
}
// 列表
export function enableAndDisable(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/enableAndDisable',
    method: 'put',
    params
  })
}
// 列表
export function updates(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/update',
    method: 'put',
    data: params
  })
}
// 列表
export function updateSerialNumber(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/updateSerialNumber',
    method: 'put',
    data: params
  })
}
