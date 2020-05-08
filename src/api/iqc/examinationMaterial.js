import request from '@/utils/request'

// 查询供应商
export function findSupplierList(params) {
  return request({
    url: '/zlSupplier/queryList',
    method: 'get',
    params
  })
}
// 查询检验员
export function checkerList(params) {
  return request({
    url: '/zlMaterialCheck/checkerList',
    method: 'get',
    params
  })
}
// 查询采购员
export function buyerList(params) {
  return request({
    url: '/zlMaterialCheck/buyerList',
    method: 'get',
    params
  })
}
// 获取该材料对应的规格型号
export function findModelByMaterialId(params) {
  return request({
    url: '/zlSpecifications/queryList',
    method: 'get',
    params
  })
}
// 获取该材料对应的年限
export function findYearsByMaterialId(params) {
  return request({
    url: '/zlYear/queryList',
    method: 'get',
    params
  })
}
// 获取该材料类型对应的过期日期
export function queryBymaterialType(params) {
  return request({
    url: '/zlOverdueConfig/queryBymaterialType',
    method: 'get',
    params
  })
}
// 获取该材料类型对应的单位
export function findUnitByMaterialId(params) {
  return request({
    url: '/zlUnit/queryList',
    method: 'get',
    params
  })
}
// 检验编号
export function getCKNO(params) {
  return request({
    url: '/zlMaterialCheck/getCKNO',
    method: 'get',
    params
  })
}
// 新增
export function insert(params) {
  return request({
    url: '/zlMaterialCheck/add',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: '/zlMaterialCheck/delete',
    method: 'delete',
    params
  })
}
// 编辑
export function edit(params) {
  return request({
    url: '/zlMaterialCheck/editor',
    method: 'put',
    data: params
  })
}
// 查询列表数据
export function queryList(params) {
  return request({
    url: '/zlMaterialCheck/query',
    method: 'get',
    params
  })
}
// 查询上传的图片
export function findByDataId(params) {
  return request({
    url: '/attachment/findByDataId',
    method: 'get',
    params
  })
}
// 删除的图片
export function deleteFile(params) {
  return request({
    url: '/attachment/deleteById',
    method: 'delete',
    params
  })
}
