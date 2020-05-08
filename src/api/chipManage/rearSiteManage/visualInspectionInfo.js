import request from '@/utils/request'

// 传片扫描
export function deliverScanning(params) {
  return request({
    url: '/xp-visual-inspection/deliver-scanning',
    method: 'get',
    params
  })
}
// 接片
export function addReceive(params) {
  return request({
    url: '/xp-visual-inspection/patch',
    method: 'post',
    data: params
  })
}
// 查询列表
export function queryList(params) {
  return request({
    url: '/xp-visual-inspection/query-list',
    method: 'get',
    params
  })
}
// 异常原因查询
export function queryClassifyList(params) {
  return request({
    url: '/xp-facade-classify/query-list',
    method: 'get',
    params
  })
}
// 传片
export function transmitting(params) {
  return request({
    url: '/xp-visual-inspection/transmitting',
    method: 'post',
    data: params
  })
}
// 获取异常数据
export function findAbnormalList(params) {
  return request({
    url: '/xp-product-exception/feed-back-visual',
    method: 'post',
    data: params
  })
}
// 异常提交
export function submitAbnormalList(params) {
  return request({
    url: '/xpAfterExceptionController/batchInsert',
    method: 'post',
    data: params
  })
}
// 获取异常数据
export function getExceptionCode(params) {
  return request({
    url: '/xp-facade-classify/get-exception-code',
    method: 'get',
    params
  })
}
// 记录异常数据
export function insertRecording(params) {
  return request({
    url: '/xp-visual-inspection/insertRecording',
    method: 'post',
    data: params
  })
}

