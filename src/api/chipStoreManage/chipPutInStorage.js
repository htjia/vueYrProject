import request from '@/utils/request'
// 入库类型
export function findFieldSelectList(params) {
  return request({
    url: '/xpReservedField/findFieldSelectList',
    method: 'get',
    params
  })
}
// 送片单查询
export function findXpWareHous(params) {
  return request({
    url: '/xpWarehous/find',
    method: 'get',
    params
  })
}
// 入库记录查询
export function findStorehouse(params) {
  return request({
    url: '/xpStorehouse/pageList',
    method: 'get',
    params
  })
}
// 入库记录wafer查询
export function findStoreDetailList(params) {
  return request({
    url: '/xpStorehouse/findDetailList',
    method: 'get',
    params
  })
}
// 送片单Wafer查询
export function findXpWareHousList(params) {
  return request({
    url: '/xpWarehous/findDetail',
    method: 'get',
    params
  })
}
// 生成包号
export function createBoxNo(params) {
  return request({
    url: '/xpStorehouse/createBoxNo',
    method: 'post',
    data: params
  })
}
// 入库
export function insertToStore(params) {
  return request({
    url: '/xpStorehouse/insert',
    method: 'post',
    data: params
  })
}
// 打印项次号标签
export function printSequence(params) {
  return request({
    url: '/xpStorehouse/printSequence',
    method: 'post',
    params
  })
}
// 打印包号标签
export function printBoxNo(params) {
  return request({
    url: '/xpStorehouse/printBoxNo',
    method: 'post',
    params
  })
}
// 退回
export function back(params) {
  return request({
    url: '/xpStorehouse/back',
    method: 'post',
    params
  })
}
// 导入入库单号code
export function findStoreCode(params) {
  return request({
    url: '/xpStorehouse/findCode',
    method: 'get',
    params
  })
}
