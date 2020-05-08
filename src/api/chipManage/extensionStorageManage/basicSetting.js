import request from '@/utils/request'

// 外延仓入库类型管理
export function ckStorehouseTypeFind(params) {
  return request({
    url: '/ckStorehouseType/pageList',
    method: 'get',
    params
  })
}
// 外延仓入库类型管理新增
export function ckStorehouseTypeAdd(params) {
  return request({
    url: '/ckStorehouseType/insert',
    method: 'post',
    data: params
  })
}
// 客户管理
export function ckCustomerFind(params) {
  return request({
    url: '/ckCustomer/pageList',
    method: 'get',
    params
  })
}
// 客户管理新增
export function ckCustomerAdd(params) {
  return request({
    url: '/ckCustomer/insert',
    method: 'post',
    data: params
  })
}
// 退库类型
export function ckBackhouseTypeFind(params) {
  return request({
    url: '/ckBackhouseType/pageList',
    method: 'get',
    params
  })
}
// 退库类型新增
export function ckBackhouseTypeAdd(params) {
  return request({
    url: '/ckBackhouseType/insert',
    method: 'post',
    data: params
  })
}
// 出库类型
export function ckOutbillTypeFind(params) {
  return request({
    url: '/ckOutbillType/pageList',
    method: 'get',
    params
  })
}
// 出库类型新增
export function ckOutbillTypeAdd(params) {
  return request({
    url: '/ckOutbillType/insert',
    method: 'post',
    data: params
  })
}
