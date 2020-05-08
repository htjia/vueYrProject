import request from '@/utils/request'

// 查询单据
export function findAuditList(params) {
  return request({
    url: '/xpOutgoing/findAuditList',
    method: 'get',
    params
  })
}
// 查询单据明细
export function findDetailList(params) {
  return request({
    url: '/xpOutgoing/findDetailList',
    method: 'get',
    params
  })
}
// 检验记录
export function findCheckResultList(params) {
  return request({
    url: '/xpOutgoing/findCheckResultList',
    method: 'get',
    params
  })
}
// 保存检验记录
export function insertCheckResult(params) {
  return request({
    url: '/xpOutgoing/insertCheckResult',
    method: 'post',
    data: params
  })
}
// 确定审核
export function audit(params) {
  return request({
    url: '/xpOutgoing/audit',
    method: 'post',
    params
  })
}
// 比例查询
export function findOutgoingPercentList(params) {
  return request({
    url: '/xpOutgoing/findOutgoingPercentList',
    method: 'get',
    params
  })
}
// 比例修改
export function updateCheckPercent(params) {
  return request({
    url: '/xpOutgoing/updateCheckPercent',
    method: 'post',
    data: params
  })
}
// 查询包list
export function findFbSelect(params) {
  return request({
    url: '/xpOutgoing/findFbSelect',
    method: 'get',
    params
  })
}
// 查询包参数
export function findGroupSubPackParams(params) {
  return request({
    url: '/xpOutgoing/findGroupSubPackParams',
    method: 'get',
    params
  })
}
// 删除记录
export function deleteCheckResult(params) {
  return request({
    url: '/xpOutgoing/deleteCheckResult',
    method: 'delete',
    params
  })
}
