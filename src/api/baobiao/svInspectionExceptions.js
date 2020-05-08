import request from '@/utils/request'

// 列表
export function findDataByDay(params) {
  return request({
    url: '/zlVisualAbnormalController/findDataByDay',
    method: 'get',
    params
  })
}
// 列表
export function findDataByWeek(params) {
  return request({
    url: '/zlVisualAbnormalController/findDataByWeek',
    method: 'get',
    params
  })
}
// 列表
export function findReason() {
  return request({
    url: '/zlVisualAbnormalController/findReason',
    method: 'get'
  })
}
// 列表
export function findData(params) {
  return request({
    url: '/zlVisualAbnormalController/findData',
    method: 'get',
    params
  })
}
// 列表
export function findDataByMachine(params) {
  return request({
    url: '/zlVisualAbnormalController/findDataByMachine',
    method: 'get',
    params
  })
}
