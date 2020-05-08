import request from '@/utils/request'

// 查询
export function getCowList(params) {
  return request({
    url: '/xp-cow-test/query-list',
    method: 'get',
    params
  })
}
// 投片类型
export function chipTypeList(params) {
  return request({
    url: '/scCategory/findSelect',
    method: 'get',
    params
  })
}
// 传片扫码
export function cowDeliverScanning(params) {
  return request({
    url: '/xp-cow-test/cow-deliver-scanning',
    method: 'get',
    params
  })
}
// 传片
export function addDeliver(params) {
  return request({
    url: '/xp-cow-test/add-cow-deliver',
    method: 'post',
    data: params
  })
}
// 接片
export function addReceive(params) {
  return request({
    url: '/xp-cow-test/add-cow-receive',
    method: 'post',
    data: params
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

// 文件查询
export function findCowWaferFile(params) {
  return request({
    url: '/xp-cow-test/cow-wafer-file',
    method: 'post',
    data: params
  })
}
// 选择文件
export function updateCowWaferFile(params) {
  return request({
    url: '/xp-cow-test/update-selected',
    method: 'post',
    data: params
  })
}
