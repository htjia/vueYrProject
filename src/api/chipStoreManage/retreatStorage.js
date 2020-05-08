import request from '@/utils/request'
// 退库查询
export function findOutWafer(params) {
  return request({
    url: '/xpBackhouse/findOutWafer',
    method: 'get',
    params
  })
}
// 退库单号查询
export function findCode(params) {
  return request({
    url: '/xpBackhouse/findCode',
    method: 'get',
    params
  })
}
// 退库记录单据查询
export function findRecordList(params) {
  return request({
    url: '/xpBackhouse/pageList',
    method: 'get',
    params
  })
}
// 退库记录wafer查询
export function findRecordWafer(params) {
  return request({
    url: '/xpBackhouse/findDetail',
    method: 'get',
    params
  })
}
// 退库方式查询
export function findBackhouseType(params) {
  return request({
    url: '/xpBackhouseType/findSelect',
    method: 'get',
    params
  })
}
// 退库提交
export function insert(params) {
  return request({
    url: '/xpBackhouse/insert',
    method: 'post',
    data: params
  })
}
// 打印包号
export function printBoxNo(params) {
  return request({
    url: '/xpBackhouse/printBoxNo',
    method: 'post',
    params
  })
}
// 打印项次号
export function printSequence(params) {
  return request({
    url: '/xpBackhouse/printSequence',
    method: 'post',
    params
  })
}
