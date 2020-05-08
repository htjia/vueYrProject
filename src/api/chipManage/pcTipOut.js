import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/xp-produceTask/query',
    method: 'get',
    params
  })
}
// 接收
export function accept(params) {
  return request({
    url: '/xp-produceTask/accept',
    method: 'get',
    params
  })
}
// 退回
export function backThe(params) {
  return request({
    url: '/xp-produceTask/backThe',
    method: 'get',
    params
  })
}
// 详情
export function info(params) {
  return request({
    url: '/xp-produceTask/info',
    method: 'get',
    params
  })
}

// 投片类型
export function cateGoryFind(params) {
  return request({
    url: '/scCategory/findSelect',
    method: 'get',
    params
  })
}
// 投片类型
export function getElectrode(params) {
  return request({
    url: '/scElectrode/findSelect',
    method: 'get',
    params
  })
}
