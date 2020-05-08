import request from '@/utils/request'

// MOCVD生产--Run信息查询
export function castSliceFind(params) {
  return request({
    url: '/wyCastSlice/find',
    method: 'get',
    params
  })
}
// 炉次查询
export function stoveFind(params) {
  return request({
    url: '/wyStove/findSelect',
    method: 'get',
    params
  })
}
// 结构类型查询
export function findStructureType(params) {
  return request({
    url: '/wyStructureType/findSelect',
    method: 'get',
    params
  })
}
// 机台人员查询
export function findMachineUser(params) {
  return request({
    url: '/wyMachineUser/list',
    method: 'get',
    params
  })
}
// wafer查询
export function findWafer(params) {
  return request({
    url: '/wyCastSlice/findWafer',
    method: 'get',
    params
  })
}
// 大盘编号查询
export function findPlatter(params) {
  return request({
    url: '/wyCastSlice/findPlatter',
    method: 'get',
    params
  })
}
// 判定指向查询
export function findDecide(params) {
  return request({
    url: '/wyDecide/find',
    method: 'get',
    params
  })
}
// 生产类型查询
export function findProduceType(params) {
  return request({
    url: '/wyProduceType/findSelect',
    method: 'get',
    params
  })
}
// Recipe
export function findRecipe(params) {
  return request({
    url: '/wyRecipeMenu/findSelect',
    method: 'get',
    params
  })
}
// 待机原因
export function findStandbyReason(params) {
  return request({
    url: '/wyStandbyReason/findSelect',
    method: 'get',
    params
  })
}
// 待机时长
export function findStandbyTime(params) {
  return request({
    url: '/wyCastSlice/findStandbyTime',
    method: 'get',
    params
  })
}
// 衬底查询
export function findSubstrate(params) {
  return request({
    url: '/wyCastSlice/findSubstrate',
    method: 'get',
    params
  })
}
// 获取已选详情信息
export function findJointSubstrate(params) {
  return request({
    url: '/wyCastSlice/findJointSubstrate',
    method: 'get',
    params
  })
}
// 获取已选详情信息
export function castSliceSave(params) {
  return request({
    url: '/wyCastSlice/save',
    method: 'post',
    data: params
  })
}
// 取片
export function takeSlice(params) {
  return request({
    url: '/wyCastSlice/takeSlice',
    method: 'post',
    params
  })
}
// 取片衬底编辑
export function editWafer(params) {
  return request({
    url: '/wyCastSlice/editWafer',
    method: 'post',
    data: params
  })
}
// 删除Run信息
export function remove(params) {
  return request({
    url: '/wyCastSlice/delete',
    method: 'delete',
    params
  })
}
