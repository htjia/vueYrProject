import request from '@/utils/request'

// 列表
export function deleteAny(params) {
  return request({
    url: '/zlVisualScrapController/delete',
    method: 'delete',
    params
  })
}
// 列表
export function anyFind(params) {
  return request({
    url: '/zlVisualScrapController/find',
    method: 'get',
    params
  })
}
// 列表
export function findReport(params) {
  return request({
    url: '/zlVisualScrapController/findReport',
    method: 'get',
    params
  })
}
// 列表
export function findScrapByWeek(params) {
  return request({
    url: '/zlVisualScrapController/findScrapByWeek',
    method: 'get',
    params
  })
}
// 列表
export function findSelect() {
  return request({
    url: '/zlVisualScrapController/findSelect',
    method: 'get'
  })
}
// 列表
export function bffindSelect() {
  return request({
    url: '/zlScrapTypeController/findSelect',
    method: 'get'
  })
}
// 列表
export function add(params) {
  return request({
    url: '/zlVisualScrapController/save',
    method: 'post',
    data: params
  })
}
// 列表
export function update(params) {
  return request({
    url: '/zlVisualScrapController/update',
    method: 'post',
    data: params
  })
}
