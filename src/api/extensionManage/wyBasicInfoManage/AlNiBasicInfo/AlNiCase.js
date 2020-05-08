import request from '@/utils/request'

// 卡塞查询
export function findStopperList(params) {
  return request({
    url: '/wyStopper/find',
    method: 'get',
    params
  })
}
// 卡塞详情查询
export function findDetail(params) {
  return request({
    url: '/wyStopper/findDetail',
    method: 'get',
    params
  })
}

// 卡塞新增
export function add(params) {
  return request({
    url: '/wyStopper/save',
    method: 'post',
    data: params
  })
}
// 卡塞删除
export function remove(params) {
  return request({
    url: '/wyStopper/delete',
    method: 'delete',
    params
  })
}
