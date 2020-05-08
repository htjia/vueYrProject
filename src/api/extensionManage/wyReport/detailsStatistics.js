import request from '@/utils/request'

// 查询
export function queryList(params) {
  return request({
    url: '/wyReportController/variousDetails',
    method: 'get',
    params
  })
}

// 查询颜色配置
export function selectConfigList(params) {
  return request({
    url: '/wyReportController/selectConfigList',
    method: 'get',
    params
  })
}
// 新增颜色配置
export function insertDetailConfig(params) {
  return request({
    url: '/wyReportController/insertDetailConfig',
    method: 'post',
    data: params
  })
}
// 编辑颜色配置
export function updateDetailConfig(params) {
  return request({
    url: '/wyReportController/updateDetailConfig',
    method: 'post',
    data: params
  })
}
// 删除颜色配置
export function deleteDetailConfig(params) {
  return request({
    url: `/wyReportController/${params.id}/deleteDetailConfig`,
    method: 'delete',
    data: params
  })
}
// 大盘查询
export function platterList() {
  return request({
    url: '/wyPlatterMocvd/findSelect',
    method: 'get'
  })
}
// 炉次查询
export function stoveFind(params) {
  return request({
    url: '/wyStove/findSelect',
    method: 'get',
    params
  })
}
// 顺序调整
export function updateSequence(params) {
  return request({
    url: '/wyReportController/updateSequence',
    method: 'post',
    data: params
  })
}
