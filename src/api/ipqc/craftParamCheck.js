import request from '@/utils/request'

// 查询班别
export function getClassList() {
  return request({
    url: '/zlTeamConfigController/find',
    method: 'get'
  })
}
// 查询列表
export function findList(params) {
  return request({
    url: '/zlCheckCraftController/find',
    method: 'get',
    params
  })
}
// 查询列表
export function findTableHead(params) {
  return request({
    url: '/zlCheckCraftController/findTableHead',
    method: 'get',
    params
  })
}
// 查询详情
export function findDetail(params) {
  return request({
    url: '/zlCheckCraftController/findDetail',
    method: 'get',
    params
  })
}
// 查询
export function craftList(params) {
  return request({
    url: '/zlCheckCraftController/findNorm',
    method: 'get',
    params
  })
}
// 添加
export function save(params) {
  return request({
    url: '/zlCheckCraftController/save',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/zlCheckCraftController/update',
    method: 'post',
    data: params
  })
}

