import request from '@/utils/request'

// 新增策略
export function addStrategy(params) {
  return request({
    url: '/WyReportRetrievalStrategy/addStrategy',
    method: 'post',
    data: params
  })
}
// 修改策略
export function updateStrategy(params) {
  return request({
    url: '/WyReportRetrievalStrategy/updateStrategy',
    method: 'post',
    data: params
  })
}
// 策略列表
export function queryStrategy(params) {
  return request({
    url: '/WyReportRetrievalStrategy/getList',
    method: 'get',
    params
  })
}
// 策略详情
export function selectDetailEachGear(params) {
  return request({
    url: '/WyReportRetrievalStrategy/selectDetailEachGear',
    method: 'get',
    params
  })
}
// 检索结果查询
export function inventoryDistribution(params) {
  return request({
    url: '/WyReportProductManagement/inventoryDistribution',
    method: 'get',
    params
  })
}
// 前端生成周期数据查询
export function earlyProductionCycle(params) {
  return request({
    url: '/XpReportProductManagement/earlyProductionCycle',
    method: 'get',
    params
  })
}
// 删除策略
export function deleteStrategy(params) {
  return request({
    url: `/WyReportRetrievalStrategy/${params.id}/deleteStrategy`,
    method: 'delete'
  })
}
