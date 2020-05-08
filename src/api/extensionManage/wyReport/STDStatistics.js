import request from '@/utils/request'

// 产品列表
export function queryAll(params) {
  return request({
    url: '/wyReportController/stdGreaterThan4',
    method: 'get',
    params
  })
}
// 生产类型查询
export function findProduceType(params) {
  return request({
    url: '/wyProduceType/findSelect',
    method: 'get',
    params
  })
}
// 衬底类型管理
export function findSubstrateType(params) {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get'
  })
}
