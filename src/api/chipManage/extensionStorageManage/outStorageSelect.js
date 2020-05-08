import request from '@/utils/request'

// 挑片完成查看
export function findWafer(params) {
  return request({
    url: '/scOutgoing/findWafer',
    method: 'get',
    params
  })
}
// 查询挑片单所有wafer
export function getList(params) {
  return request({
    url: '/scOutgoing/findRuleWafer',
    method: 'get',
    params
  })
}
// 微调换片查询
export function findStoreDetailByWafer(params) {
  return request({
    url: '/scOutgoing/findStoreDetailByWafer',
    method: 'get',
    params
  })
}
// 生成盒号
export function createBoxNo(params) {
  return request({
    url: '/scOutgoing/createBoxNo',
    method: 'post',
    data: params
  })
}
// 生成出库单号
export function createNo(params) {
  return request({
    url: '/scOutgoing/createNo',
    method: 'post',
    params
  })
}
// 保存
export function trial(params) {
  return request({
    url: '/scOutgoing/trial',
    method: 'post',
    data: params
  })
}
// 库存调整
export function stroeAdjust(params) {
  return request({
    url: '/scOutgoing/stroeAdjust',
    method: 'post',
    data: params
  })
}
// 换片
export function updateWafer(params) {
  return request({
    url: '/scOutgoing/updateWafer',
    method: 'post',
    data: params
  })
}
// 打印标签
export function printOutBill(params) {
  return request({
    url: '/scOutgoing/printOutBill',
    method: 'get',
    params
  })
}

// 打印盒标签
export function printLabel(params) {
  return request({
    url: '/scOutgoing/printLabel',
    method: 'post',
    params
  })
}
// 重新挑片
export function refreshBoxNo(params) {
  return request({
    url: '/scOutgoing/refreshBoxNo',
    method: 'post',
    params
  })
}

