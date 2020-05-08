import request from '@/utils/request'
// 入库类型
export function storehouseTypeList(params) {
  return request({
    url: '/xpStorehouseType/pageList',
    method: 'get',
    params
  })
}
// 入库类型添加
export function storehouseTypeAdd(params) {
  return request({
    url: '/xpStorehouseType/insert',
    method: 'post',
    data: params
  })
}
// 芯片产地添加
export function placeOriginAdd(params) {
  return request({
    url: '/xpChipProduct/insert',
    method: 'post',
    data: params
  })
}
// 入库类型删除
export function storehouseTypeDelete(params) {
  return request({
    url: `xpStorehouseType/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 芯片产地删除
export function placeOriginDelete(params) {
  return request({
    url: `xpChipProduct/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 产地查询
export function placeOriginList(params) {
  return request({
    url: '/xpChipProduct/pageList',
    method: 'get',
    params
  })
}
// 预留字段查询
export function reservedFieldList(params) {
  return request({
    url: '/xpReservedField/findList',
    method: 'get',
    params
  })
}
// 预留字段新增
export function reservedFieldAdd(params) {
  return request({
    url: '/xpReservedField/insert',
    method: 'post',
    data: params
  })
}
// 预留字段新增选项
export function reservedFieldAddOption(params) {
  return request({
    url: '/xpReservedField/insertSelect',
    method: 'post',
    data: params
  })
}
// 预留字段选项查询
export function findReservedFieldOption(params) {
  return request({
    url: '/xpReservedField/findSelectList',
    method: 'get',
    params
  })
}
// 预留字段选项删除
export function deleteReservedFieldOption(params) {
  return request({
    url: `xpReservedField/${params.id}/deleteSelect`,
    method: 'get',
    params
  })
}
