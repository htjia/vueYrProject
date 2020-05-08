import request from '@/utils/request'

// 入库单查询
export function findWyWareHous(params) {
  return request({
    url: '/ckStorehouse/findWyWareHous',
    method: 'get',
    params
  })
}
// 入库单Wafer查询
export function findWyWareHousList(params) {
  return request({
    url: '/ckStorehouse/findWyWareHousList',
    method: 'get',
    params
  })
}
// 入库类型查询
export function findPutInTypeList(params) {
  return request({
    url: '/ckStorehouseType/findList',
    method: 'get',
    params
  })
}

// 入库柜位查询
export function findCabinetList(params) {
  return request({
    url: '/ckArk/findList',
    method: 'get',
    params
  })
}
// 入库单号查询
export function findPutInCode(params) {
  return request({
    url: '/ckStorehouse/findCode',
    method: 'get',
    params
  })
}
//  所有Run查询
export function findRunList(params) {
  return request({
    url: '/ckStorehouse/findRunList',
    method: 'get',
    params
  })
}
//  所有box查询
export function findBoxList(params) {
  return request({
    url: '/ckStorehouse/findBoxList',
    method: 'get',
    params
  })
}
//  新增
export function insert(params) {
  return request({
    url: '/ckStorehouse/insert',
    method: 'post',
    data: params
  })
}
// 入库记录
export function findRecordList(params) {
  return request({
    url: '/ckStorehouse/pageList',
    method: 'get',
    params
  })
}
// 入库记录
export function findStoreHouseDetail(params) {
  return request({
    url: '/ckStorehouse/findStoreHouseDetail',
    method: 'get',
    params
  })
}
// 打印。。。
export function printLabel(params) {
  return request({
    url: '/ckStorehouse/printLabel',
    method: 'post',
    params
  })
}
