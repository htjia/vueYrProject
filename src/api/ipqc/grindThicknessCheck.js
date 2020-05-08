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
    url: '/zlCheckGrindController/find',
    method: 'get',
    params
  })
}
// 查询详情
export function findDetail(params) {
  return request({
    url: '/zlCheckGrindController/findDetail',
    method: 'get',
    params
  })
}
// 查询
export function findNorm(params) {
  return request({
    url: '/zlCheckGrindController/findNorm',
    method: 'get',
    params
  })
}
// 添加
export function save(params) {
  return request({
    url: '/zlCheckGrindController/save',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/zlCheckGrindController/update',
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
