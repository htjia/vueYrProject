import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/ckStorehouse/queryStoreWafer',
    method: 'get',
    params
  })
}
// 设置备注
export function updateRemark(params) {
  return request({
    url: '/ckStorehouse/updateRemark',
    method: 'post',
    params
  })
}
// pc 投片型号
export function findModelList(params) {
  return request({
    url: '/gyModelColor/findModelList',
    method: 'get',
    params
  })
}
// 验证版型
export function findVerifyList(params) {
  return request({
    url: '/wy-verify-layout-setting/query',
    method: 'get',
    params
  })
}
// 衬底尺寸
export function findSubstrateMeasureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 目检等级
export function findlevelList(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 衬底类型
export function findSubstrateTypeList(params) {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get',
    params
  })
}
// 生产类型
export function findProduceTypeList(params) {
  return request({
    url: '/wyProduceType/findSelect',
    method: 'get',
    params
  })
}
// 外延仓入库类型管理(产地)
export function ckStorehouseTypeFind(params) {
  return request({
    url: '/ckStorehouseType/findList',
    method: 'get',
    params
  })
}
