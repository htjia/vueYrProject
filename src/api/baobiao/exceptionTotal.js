import request from '@/utils/request'

// 列表
export function selects(params) {
  return request({
    url: '/xpExceptionSummaryStatistics/select',
    method: 'get',
    params
  })
}
// 列表
export function selectlv(params) {
  return request({
    url: '/xpExceptionSummaryStatistics/selectlv',
    method: 'get',
    params
  })
}
// 列表
export function adds(params) {
  return request({
    url: '/xpExceptionSummaryStatistics/add',
    method: 'post',
    data: params
  })
}
// 列表
export function deletes(params) {
  return request({
    url: '/xpExceptionSummaryStatistics/delete',
    method: 'delete',
    params
  })
}
// 列表
export function selectAll(params) {
  return request({
    url: '/xpExceptionClassificationConfiguration/selectAll',
    method: 'get',
    params
  })
}
// 列表
export function updates(params) {
  return request({
    url: '/xpExceptionSummaryStatistics/update',
    method: 'put',
    data: params
  })
}
