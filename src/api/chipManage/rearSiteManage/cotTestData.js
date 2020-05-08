import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/xpCotDeliver/find',
    method: 'get',
    params
  })
}
// 列表查询
export function findRecord(params) {
  return request({
    url: '/xpCotDeliver/findRecord',
    method: 'get',
    params
  })
}
// 异常查询
export function findException(params) {
  return request({
    url: '/xpCotDeliver/findException',
    method: 'get',
    params
  })
}

// 接片扫描查询
export function receiveScanning(params) {
  return request({
    url: '/xp-scanning/scanning',
    method: 'get',
    params
  })
}

// 扫描查询findScan
export function findScanByBatchNo(params) {
  return request({
    url: '/xpCotDeliver/findScanByBatchNo',
    method: 'get',
    params
  })
}
// findWaferInfo
export function findWaferInfo(params) {
  return request({
    url: '/xpCotDeliver/findWaferInfo',
    method: 'get',
    params
  })
}
// importCot
export function importCot(params) {
  return request({
    url: '/xpCotDeliver/importCot',
    method: 'post',
    data: params
  })
}
// save
export function addDeliver(params) {
  return request({
    url: '/xpCotDeliver/save',
    method: 'post',
    data: params
  })
}
// 接片确认
export function addReceive(params) {
  return request({
    url: '/xpCotDeliver/add-receive',
    method: 'post',
    data: params
  })
}
// 投片类型
export function findCategory(params) {
  return request({
    url: '/scCategory/findSelect',
    method: 'get',
    params
  })
}
// 获取异常数据
export function findAbnormalList(params) {
  return request({
    url: '/xp-product-exception/feed-back',
    method: 'post',
    data: params
  })
}
// 文件下载
export function downByPath(params) {
  return request({
    url: '/attachment/downByPath',
    method: 'get',
    params
  })
}
// 批量查询
export function mulFind(params) {
  return request({
    url: '/xpCotDeliver/mulFind',
    method: 'get',
    params
  })
}
// 批量下载
export function mulDown(params) {
  return request({
    url: '/xpCotDeliver/mulDown',
    method: 'get',
    params
  })
}

