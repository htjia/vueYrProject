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
    url: '/zlCheckFacaeController/find',
    method: 'get',
    params
  })
}
// 查询列表
export function findTableHead(params) {
  return request({
    url: '/zlCheckFacaeController/findTableHead',
    method: 'get',
    params
  })
}
// 查询详情
export function findDetail(params) {
  return request({
    url: '/zlCheckFacaeController/findDetail',
    method: 'get',
    params
  })
}
// 查询
export function getNumList() {
  return request({
    url: '/zlFacaeNorm/findNum',
    method: 'get'
  })
}
// 查询
export function craftList(params) {
  return request({
    url: '/zlCheckFacaeController/findNorm',
    method: 'get',
    params
  })
}
// 添加
export function save(params) {
  return request({
    url: '/zlCheckFacaeController/save',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/zlCheckFacaeController/update',
    method: 'post',
    data: params
  })
}

