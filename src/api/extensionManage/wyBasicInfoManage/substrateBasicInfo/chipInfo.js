
import request from '@/utils/request'

// 光色系列
export function yrWyStructureSeries(params) {
  return request({
    url: '/yrWyStructureSeriesController/findSelect',
    method: 'get',
    params
  })
}

// 生产类型查询
export function findProduceType(params) {
  return request({
    url: '/wyProduceType/findAll',
    method: 'get',
    params
  })
}
// 生产类型删除
export function deleteProduceType(params) {
  return request({
    url: '/wyProduceType/delete',
    method: 'delete',
    params
  })
}
// 生产类型新增
export function addProduceType(params) {
  return request({
    url: '/wyProduceType/save',
    method: 'post',
    data: params
  })
}
// 生产类型修改
export function updateProduceType(params) {
  return request({
    url: '/wyProduceType/disableEnable',
    method: 'post',
    params
  })
}

// 结构类型查询
export function findStructureType(params) {
  return request({
    url: '/wyStructureType/findAll',
    method: 'get',
    params
  })
}
// 结构类型删除
export function deleteStructureType(params) {
  return request({
    url: '/wyStructureType/delete',
    method: 'delete',
    params
  })
}
// 结构类型新增
export function addStructureType(params) {
  return request({
    url: '/wyStructureType/save',
    method: 'post',
    data: params
  })
}
// 结构类型修改
export function updateStructureType(params) {
  return request({
    url: '/wyStructureType/disableEnable',
    method: 'post',
    params
  })
}

// 炉号查询
export function findStove(params) {
  return request({
    url: '/wyStove/findAll',
    method: 'get',
    params
  })
}
// 炉号删除
export function deleteStove(params) {
  return request({
    url: '/wyStove/delete',
    method: 'delete',
    params
  })
}
// 炉号新增
export function addStove(params) {
  return request({
    url: '/wyStove/save',
    method: 'post',
    data: params
  })
}
// 炉号修改
export function updateStove(params) {
  return request({
    url: '/wyStove/disableEnable',
    method: 'post',
    params
  })
}

// 待机原因查询
export function findStandbyReason(params) {
  return request({
    url: '/wyStandbyReason/findAll',
    method: 'get',
    params
  })
}
// 待机原因删除
export function deleteStandbyReason(params) {
  return request({
    url: '/wyStandbyReason/delete',
    method: 'delete',
    params
  })
}
// 待机原因新增
export function addStandbyReason(params) {
  return request({
    url: '/wyStandbyReason/save',
    method: 'post',
    data: params
  })
}
// 待机原因修改
export function updateStandbyReason(params) {
  return request({
    url: '/wyStandbyReason/disableEnable',
    method: 'post',
    params
  })
}

// 光色系列删除
export function deleteController(params) {
  return request({
    url: '/yrWyStructureSeriesController/deleteFake',
    method: 'delete',
    params
  })
}
// 光色系列新增
export function createController(params) {
  return request({
    url: '/yrWyStructureSeriesController/save',
    method: 'post',
    data: params
  })
}
// 光色系列修改
export function editController(params) {
  return request({
    url: '/yrWyStructureSeriesController/update',
    method: 'post',
    data: params
  })
}
// 光色系列查询
export function findController(params) {
  return request({
    url: '/yrWyStructureSeriesController/find',
    method: 'get',
    params
  })
}
// 光色系列修改
export function updateSeries(params) {
  return request({
    url: '/wyStructureType/updateSeries',
    method: 'post',
    params
  })
}
