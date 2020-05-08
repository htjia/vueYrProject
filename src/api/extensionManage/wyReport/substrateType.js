import request from '@/utils/request'

// 查询
export function queryList(params) {
  return request({
    url: '/wyReportController/findSubstrate',
    method: 'get',
    params
  })
}
// 查询厂家
export function findSupplier(params) {
  return request({
    url: '/wyReportController/findSupplier',
    method: 'get',
    params
  })
}
