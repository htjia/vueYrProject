import request from '@/utils/request'

// 大盘查询
export function platterMocvdList(params) {
  return request({
    url: '/wyPlatterMocvd/list',
    method: 'get',
    params
  })
}

// 新增大盘
export function addPlatter(params) {
  return request({
    url: '/wyPlatterMocvd/insert',
    method: 'post',
    data: params
  })
}
// 打印条码
export function printLabel(params) {
  return request({
    url: '/print/printLabel',
    method: 'post',
    data: params
  })
}
// 大盘使用记录
export function findUseRecordList(params) {
  return request({
    url: '/wyPlatterMocvd/findUseRecordList',
    method: 'get',
    params
  })
}

// 忽略异常
export function abnormalDeal(params) {
  return request({
    url: '/wyPlatterMocvd/abnormalDeal',
    method: 'put',
    params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/wyPlatterMocvd/${params.id}/delete`,
    method: 'delete'
  })
}

// 修改
export function update(params) {
  return request({
    url: '/wyPlatterMocvd/update',
    method: 'put',
    data: params
  })
}
