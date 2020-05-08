import request from '@/utils/request'

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
// 列表
export function findList(params) {
  return request({
    url: '/xp-product-exception/query-list',
    method: 'get',
    params
  })
}
// 异常判定
export function determine(params) {
  return request({
    url: '/xp-product-exception/determine',
    method: 'post',
    data: params
  })
}
// 流程卡
export function gyFlowCardFind() {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 流程卡
export function gyFlowCardFindback(params) {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params
  })
}
// 异常完成
export function completeDeterMine(params) {
  return request({
    url: '/xp-product-exception/complete-determine',
    method: 'get',
    params
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
// 返工单号
export function exceptionBill(params) {
  return request({
    url: '/xp-exception-rework/obtain-rework-batch-no',
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
// 列表
export function findErrorList() {
  return request({
    url: '/xp-abnormal-classification/query-list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
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
export function getDetails(params) {
  return request({
    url: '/xp-product-exception/getDetails',
    method: 'get',
    params
  })
}
export function findAfter(params) {
  return request({
    url: '/xpAfterExceptionController/find',
    method: 'get',
    params
  })
}
export function queryBack(params) {
  return request({
    url: 'gy-process/query',
    method: 'get',
    params
  })
}
export function findCreator() {
  return request({
    url: '/xpAfterExceptionController/findCreator',
    method: 'get'
  })
}
export function findAuditor() {
  return request({
    url: '/xpAfterExceptionController/findAuditor',
    method: 'get'
  })
}
export function findModel() {
  return request({
    url: '/xpAfterExceptionController/findModel',
    method: 'get'
  })
}
export function updateAfter(params) {
  return request({
    url: '/xpAfterExceptionController/update',
    method: 'post',
    params
  })
}

