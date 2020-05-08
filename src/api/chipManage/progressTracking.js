import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/xp-produceTrack/listLoad',
    method: 'get',
    params
  })
}

// 查询进度
export function getInfo(params) {
  return request({
    url: '/xp-produceTrack/info',
    method: 'post',
    params
  })
}
// 查询芯片
export function getInfoFromBatch(params) {
  return request({
    url: '/xp-produceTask/getInfoFromBatchs',
    method: 'get',
    params
  })
}

// 查询生产数据
export function productData(params) {
  return request({
    url: '/xp-produceTrack/productData',
    method: 'post',
    params
  })
}
// 暂停恢复
export function pause(params) {
  return request({
    url: '/xp-produceTrack/pause',
    method: 'post',
    params
  })
}
// 预约暂停/恢复
export function expectStop(params) {
  return request({
    url: '/xp-produceTrack/expectStop',
    method: 'post',
    params
  })
}
