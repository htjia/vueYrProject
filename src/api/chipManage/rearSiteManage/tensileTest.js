import request from '@/utils/request'

// 查询list
export function getTensileList(params) {
  return request({
    url: '/xp-tensile-test/query-list',
    method: 'get',
    params
  })
}

// 传片扫描
export function deliverScanning(params) {
  return request({
    url: '/xp-tensile-test/deliver-scanning',
    method: 'get',
    params
  })
}
// 传片
export function addDeliver(params) {
  return request({
    url: '/xp-tensile-test/add-deliver',
    method: 'post',
    data: params
  })
}
// 接片
export function addReceive(params) {
  return request({
    url: '/xp-tensile-test/add-receive',
    method: 'post',
    data: params
  })
}
// 机台人员查询
export function findMachineUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
// 后段接片扫描
export function receiveScanning(params) {
  return request({
    url: '/xp-scanning/scanning',
    method: 'get',
    params
  })
}
// 后段分选后扫描
export function afterSortingScan(params) {
  return request({
    url: '/xp-scanning/after-sorting-scanning',
    method: 'get',
    params
  })
}
// 异常提交
export function abnormalSave(params) {
  return request({
    url: '/xp-product-exception/add-exception',
    method: 'post',
    data: params
  })
}
// 型号列表
export function findModelList() {
  return request({
    url: '/gyModelColor/findModelList',
    method: 'get'
  })
}
// 异常上传
export function batchInsert(params) {
  return request({
    url: '/xpAfterExceptionController/batchInsert',
    method: 'post',
    data: params
  })
}
// 记录掉电极
export function addDropElectrodeRecord(params) {
  return request({
    url: '/xp-tensile-test/addDropElectrodeRecord',
    method: 'post',
    data: params
  })
}
