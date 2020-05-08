import request from '@/utils/request'

// 查询
export function getOutStorageList(params) {
  return request({
    url: '/scOutgoing/find',
    method: 'get',
    params
  })
}
// 挑片规则明细
export function findOutgoingRule(params) {
  return request({
    url: '/scOutgoing/findOutgoingRule',
    method: 'get',
    params
  })
}
// 特殊挑片规则明细
export function findPickWafer(params) {
  return request({
    url: '/scOutgoing/findPickWafer',
    method: 'get',
    params
  })
}
// 客户
export function findCustomer(params) {
  return request({
    url: '/ckCustomer/findList',
    method: 'get',
    params
  })
}
// 挑片规则
export function findPickRule(params) {
  return request({
    url: '/scPickRule/findSelect',
    method: 'get',
    params
  })
}
// 库存调整
export function outgoingSave(params) {
  return request({
    url: '/scOutgoing/save',
    method: 'post',
    data: params
  })
}
// 单据类型 （出库类型）
export function ckOutbillTypeFind(params) {
  return request({
    url: '/ckOutbillType/findList',
    method: 'get',
    params
  })
}
// 规则count 查询
export function findWaferCountByRule(params) {
  return request({
    url: '/scPickRule/findWaferCountByRule',
    method: 'get',
    params
  })
}
// 打印透视表
export function printArkBoxList(params) {
  return request({
    url: '/scOutgoing/printArkBoxList',
    method: 'get',
    params
  })
}
