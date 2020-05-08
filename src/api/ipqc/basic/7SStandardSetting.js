import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/zlSevenItemController/zlSevenItemFindList',
    method: 'get',
    params
  })
}
// 查询类别列表
export function getTypeList() {
  return request({
    url: '/zlSevenCategoryController/zlSevenCategoryFindAll',
    method: 'get'
  })
}
// 新增类别
export function addType(param) {
  return request({
    url: '/zlSevenCategoryController/zlSevenCategoryAdd',
    method: 'post',
    data: param
  })
}
// 修改类别
export function updateType(param) {
  return request({
    url: '/zlSevenCategoryController/zlSevenCategoryUpdate',
    method: 'post',
    data: param
  })
}
// 新增项目
export function addList(param) {
  return request({
    url: '/zlSevenItemController/zlSevenItemInsert',
    method: 'post',
    data: param
  })
}
// 修改项目
export function updateList(param) {
  return request({
    url: '/zlSevenItemController/zlSevenItemUpdate',
    method: 'post',
    data: param
  })
}
// 修改
export function zlSevenItemUpdateSequence(params) {
  return request({
    url: '/zlSevenItemController/zlSevenItemUpdateSequence',
    method: 'post',
    data: params
  })
}
// 修改
export function zlSevenCategoryUpdateCategoryOrder(params) {
  return request({
    url: '/zlSevenCategoryController/zlSevenCategoryUpdateCategoryOrder',
    method: 'post',
    data: params
  })
}
// 删除禁用
export function zlSevenItemUpdateStatus(params) {
  return request({
    url: '/zlSevenItemController/zlSevenItemUpdateStatus',
    method: 'post',
    data: params
  })
}
// 查询车间列表
export function findcj() {
  return request({
    url: '/zlSevenWorkShopController/find',
    method: 'get'
  })
}
// 新增车间
export function savecjList(param) {
  return request({
    url: '/zlSevenWorkShopController/save',
    method: 'post',
    data: param
  })
}
// 修改车间
export function updatecjList(param) {
  return request({
    url: '/zlSevenWorkShopController/update',
    method: 'post',
    data: param
  })
}
// 删除车间
export function deletecj(param) {
  return request({
    url: '/zlSevenWorkShopController/delete',
    method: 'delete',
    params: {
      id: param.id
    }
  })
}
