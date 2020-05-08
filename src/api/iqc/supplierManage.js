import request from '@/utils/request'

// 查询
export function findSupplierList(params) {
  return request({
    url: '/zlSupplier/query',
    method: 'get',
    params
  })
}
// 查询所有供应商
export function findList(params) {
  return request({
    url: '/zlSupplier/queryList',
    method: 'get',
    params
  })
}
// 新增
export function addSupplier(params) {
  return request({
    url: '/zlSupplier/add',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteSupplier(params) {
  return request({
    url: '/zlSupplier/delete',
    method: 'delete',
    params
  })
}
// 编辑
export function updateSupplier(params) {
  return request({
    url: '/zlSupplier/edtior',
    method: 'put',
    data: params
  })
}
// 修改状态
export function enableOrDisable(params) {
  return request({
    url: '/zlSupplier/enableOrDisable',
    method: 'put',
    params
  })
}
// 查询供货记录
export function findMaterialCheck(params) {
  return request({
    url: '/zlMaterialCheck/query',
    method: 'get',
    params
  })
}
