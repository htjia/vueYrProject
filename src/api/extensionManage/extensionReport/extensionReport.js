import request from '@/utils/request'

// 列表
export function wyList(params) {
  return request({
    url: '/wyQuery/list',
    method: 'get',
    params
  })
}

// 大盘管理
export function mocvdList() {
  return request({
    url: '/wyPlatterMocvd/findSelect',
    method: 'get'
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
// 衬底尺寸管理
export function cdfindList() {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get'
  })
}
