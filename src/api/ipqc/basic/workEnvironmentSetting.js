import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/zlEnvPointController/zlEnvPointFindList',
    method: 'get',
    params
  })
}
// 查询类别列表
export function getTypeList() {
  return request({
    url: '/zlEnvWorkShopController/zlEnvWorkShopFindAll',
    method: 'get'
  })
}
// 新增类别
export function addType(param) {
  return request({
    url: '/zlEnvWorkShopController/zlEnvWorkShopAdd',
    method: 'post',
    data: param
  })
}
// 修改类别
export function updateType(param) {
  return request({
    url: '/zlEnvWorkShopController/zlEnvWorkShopUpdate',
    method: 'post',
    data: param
  })
}
// 新增项目
export function addList(param) {
  return request({
    url: '/zlEnvPointController/zlEnvPointInsert',
    method: 'post',
    data: param
  })
}
// 修改项目
export function updateList(param) {
  return request({
    url: '/zlEnvPointController/zlEnvPointUpdate',
    method: 'post',
    data: param
  })
}
// 修改
export function zlEnvPointUpdateSequence(params) {
  return request({
    url: '/zlEnvPointController/zlEnvPointUpdateSequence',
    method: 'post',
    data: params
  })
}
// 修改
export function zlEnvWorkShopUpdateWorkshopOrder(params) {
  return request({
    url: '/zlEnvWorkShopController/zlEnvWorkShopUpdateWorkshopOrder',
    method: 'post',
    data: params
  })
}
// 删除禁用
export function zlEnvPointUpdateStatus(params) {
  return request({
    url: '/zlEnvPointController/zlEnvPointUpdateStatus',
    method: 'post',
    data: params
  })
}

// 删除
export function removeProject(params) {
  return request({
    url: '/zlEnvWorkShopController/delete',
    method: 'delete',
    params
  })
}
