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
    url: '/zlCheckSevenController/find',
    method: 'get',
    params
  })
}
// 查询详情
export function findDetail(params) {
  return request({
    url: '/zlCheckSevenController/findDetail',
    method: 'get',
    params
  })
}
// 查询
export function findNorm(params) {
  return request({
    url: '/zlCheckSevenController/findNorm',
    method: 'get',
    params
  })
}
// 添加
export function save(params) {
  return request({
    url: '/zlCheckSevenController/save',
    method: 'post',
    data: params
  })
}
// 查询详情
export function findTableHead(params) {
  return request({
    url: '/zlCheckSevenController/findTableHead',
    method: 'get',
    params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/zlCheckSevenController/update',
    method: 'post',
    data: params
  })
}
// 修改
export function checkWafer(params) {
  return request({
    url: '/zlCheckGrindController/checkWafer',
    method: 'get',
    params
  })
}
// 查询车间列表
export function findcj() {
  return request({
    url: '/zlSevenWorkShopController/find',
    method: 'get'
  })
}
