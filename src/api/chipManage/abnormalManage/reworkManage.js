import request from '@/utils/request'

// 衬底尺寸
export function findSubstrateMeasureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 待返工列表
export function waitList(params) {
  return request({
    url: '/xp-exception-rework/query-wait-rework',
    method: 'get',
    params
  })
}
// 返工列表
export function hasList(params) {
  return request({
    url: '/xp-exception-rework/query-has-rework',
    method: 'get',
    params
  })
}
// 客户列表
export function customerList() {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 产品管理
export function productList() {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get'
  })
}
// 流程卡
export function gyFlowCardFind() {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params: {
      type: 2,
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 提交返工
export function submitWrok(params) {
  return request({
    url: '/xp-exception-rework/submit-rework',
    method: 'post',
    data: params
  })
}
export function reworkNo(params) {
  return request({
    url: '/xp-exception-rework/obtain-rework-batch-no',
    method: 'get',
    params
  })
}
// 流程卡
export function findProcessAndModel(params) {
  return request({
    url: '/gyFlowCard/findProcessAndModel',
    method: 'get',
    params
  })
}
// 查询单条流程卡信息
export function fetchCardInfo(params) {
  return request({
    url: '/gyFlowCard/findProcessAndModel',
    method: 'get',
    params
  })
}

