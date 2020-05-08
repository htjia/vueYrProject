import request from '@/utils/request'
// 库存调出查询
export function findKctzWaferList(params) {
  return request({
    url: '/xpOutgoing/findKctzWaferList',
    method: 'get',
    params
  })
}
// 库存调出新增
export function insertKctz(params) {
  return request({
    url: '/xpOutgoing/insertKctz',
    method: 'post',
    data: params
  })
}
// 出库记录查询
export function findOutList(params) {
  return request({
    url: '/xpOutgoing/find',
    method: 'get',
    params
  })
}
// 出库记录wafer查询
export function findDetailList(params) {
  return request({
    url: '/xpOutgoing/findDetailList',
    method: 'get',
    params
  })
}
// 订单客户查询
export function findCustomerList(params) {
  return request({
    url: '/yrDdCustomerController/findSelect',
    method: 'get',
    params
  })
}
// 订单查询
export function findOrderList(params) {
  return request({
    url: '/yrDdOrderController/findPage',
    method: 'get',
    params
  })
}
// 出库单号查询
export function findOutCode(params) {
  return request({
    url: '/xpOutgoing/findCode',
    method: 'get',
    params
  })
}
// 分档查询
export function findSubPackList(params) {
  return request({
    url: '/xpOutgoing/findSubPackList',
    method: 'get',
    params
  })
}
// 分档 all wafer查询
export function findAllWaferByRule(params) {
  return request({
    url: '/xpOutgoing/findAllWaferByRule',
    method: 'post',
    data: params
  })
}
// 分档 wafer查询
export function findWaferByRule(params) {
  return request({
    url: '/xpOutgoing/findWaferByRule',
    method: 'get',
    params
  })
}
// 分包明细列表查询
export function findFbDetailGroup(params) {
  return request({
    url: '/xpOutgoing/findFbDetailGroup',
    method: 'get',
    params
  })
}
// 分包明细wafer查询
export function findFbDetailList(params) {
  return request({
    url: '/xpOutgoing/findFbDetailList',
    method: 'get',
    params
  })
}
// 已经分包id查询
export function findOutgoingId(params) {
  return request({
    url: '/xpOutgoing/findOutgoingId',
    method: 'get',
    params
  })
}
// 删除已经分配的包
export function deleteBox(params) {
  return request({
    url: '/xpOutgoing/deleteBox',
    method: 'delete',
    params
  })
}
// 删除已经分配的包的wafer
export function deleteBoxWafer(params) {
  return request({
    url: '/xpOutgoing/deleteDetail',
    method: 'delete',
    params
  })
}
// 开始分包
export function insertXsfb(params) {
  return request({
    url: '/xpOutgoing/insertXsfb',
    method: 'post',
    data: params
  })
}
// 分为新包
export function updateNewBox(params) {
  return request({
    url: '/xpOutgoing/updateNewBox',
    method: 'post',
    params
  })
}
// 微调换片
export function converWafer(params) {
  return request({
    url: '/xpOutgoing/converWafer',
    method: 'post',
    params
  })
}

// 打印出库单
export function printOutBill(params) {
  return request({
    url: '/xpOutgoing/printOutBill',
    method: 'post',
    params
  })
}
// 完成挑片
export function finishXsfb(params) {
  return request({
    url: '/xpOutgoing/finishXsfb',
    method: 'post',
    params
  })
}

// 重新分包
export function remove(params) {
  return request({
    url: '/xpOutgoing/delete',
    method: 'delete',
    params
  })
}
