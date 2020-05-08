import request from '@/utils/request'

// 查询
export function findCk(params) {
  return request({
    url: '/scOutgoing/find',
    method: 'get',
    params
  })
}
// 删除
export function deleteCk(params) {
  return request({
    url: '/scOutgoing/delete',
    method: 'delete',
    params
  })
}
// 出库单转换
export function conversion(params) {
  return request({
    url: '/scOutgoing/conversion',
    method: 'post',
    params
  })
}
// 保存
export function save(params) {
  return request({
    url: '/scOutgoing/save',
    method: 'post',
    data: params
  })
}
// 挑片规则
export function findSelect(params) {
  return request({
    url: '/scPickRule/findSelect',
    method: 'get',
    params
  })
}
// 客户列表
export function customerList(params) {
  return request({
    url: '/ckCustomer/findList',
    method: 'get',
    params
  })
}
// 单据类型
export function findSingleList() {
  return request({
    url: '/ckOutbillType/findList',
    method: 'get'
  })
}

