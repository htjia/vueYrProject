import request from '@/utils/request'

// 清洗管理
export function getdList(params) {
  return request({
    url: '/xp-clean-crossing/query-list',
    method: 'get',
    params
  })
}

// 导出数据
export function deriveData(params) {
  return request({
    url: '/xp-clean-crossing/export-data',
    method: 'get',
    params
  })
}
// 传片扫描
export function scanning(params) {
  return request({
    url: '/xp-scanning/scanning',
    method: 'get',
    params
  })
}
// 异常上报
export function findAbnormalList(params) {
  return request({
    url: '/xp-product-exception/add-exception',
    method: 'post',
    data: params
  })
}
// 传片
export function addDeliver(params) {
  return request({
    url: '/xp-clean-crossing/add',
    method: 'post',
    data: params
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
