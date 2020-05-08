import request from '@/utils/request'

// 列表
export function getRunList(params) {
  return request({
    url: '/wyCraftEvent/getRunList',
    method: 'get',
    params
  })
}
export function getWaferInfo(params) {
  return request({
    url: '/wyCraftEvent/getWaferInfo',
    method: 'get',
    params
  })
}
// 机台管理
export function matfindList() {
  return request({
    url: '/wyMachine/findList',
    method: 'get'
  })
}
// 炉号管理
export function furnacefindAll(params) {
  return request({
    url: '/wyStove/findAll',
    method: 'get',
    params
  })
}
// 保存
export function save(params) {
  return request({
    url: '/wyCraftEvent/save',
    method: 'post',
    data: params
  })
}
// 保存
export function reset(params) {
  return request({
    url: '/wyCraftEvent/reset',
    method: 'post',
    params
  })
}
// 保存
export function findResetList(params) {
  return request({
    url: '/wyCraftEvent/findEvent',
    method: 'get',
    params
  })
}
