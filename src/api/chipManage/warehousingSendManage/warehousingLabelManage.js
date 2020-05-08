import request from '@/utils/request'

// 入库标签列表
export function xpWarehousLabel(params) {
  return request({
    url: '/xpWarehousLabel/find',
    method: 'get',
    params
  })
}
// 客户列表
export function customerList(params) {
  return request({
    url: '/xpCustomer/findList',
    method: 'get',
    params
  })
}
// 删除
export function deleteLabel(params) {
  return request({
    url: `/xpWarehousLabel/${params.id}/delete`,
    method: 'delete',
    params
  })
}
export function insert(params) {
  return request({
    url: '/xpWarehousLabel/insert',
    method: 'post',
    data: params
  })
}
export function update(params) {
  return request({
    url: '/xpWarehousLabel/update',
    method: 'put',
    data: params
  })
}
export function imgfindById(params) {
  return request({
    url: '/attachment/findById',
    method: 'get',
    params
  })
}
export function scanWafer(params) {
  return request({
    url: '/xpMapping/scanWafer',
    method: 'get',
    params
  })
}
export function scanLabelWafer(params) {
  return request({
    url: '/xpWarehousLabel/scanWafer',
    method: 'get',
    params
  })
}
// 日志
export function logFind(params) {
  return request({
    url: '/xpWarehousPrintRecord/find',
    method: 'get',
    params
  })
}
// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
// 型号管理
export function findModelList() {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 列表
export function findSettList(params) {
  return request({
    url: '/xpMapping/find',
    method: 'get',
    params
  })
}
// 切换打印状态
export function updateIsPrint(params) {
  return request({
    url: '/xpMapping/updateIsPrint',
    method: 'put',
    params
  })
}
// 打印
export function printMapping(params) {
  return request({
    url: '/xpMapping/printMapping',
    method: 'post',
    data: params
  })
}
// 打印
export function printLabelMapping(params) {
  return request({
    url: '/xpWarehousLabel/printLabel',
    method: 'post',
    data: params
  })
}
// 查询变量
export function findCommParams() {
  return request({
    url: '/xpWarehousLabel/findCommParams',
    method: 'get'
  })
}
// 查询变量
export function findParamsById(params) {
  return request({
    url: '/xpWarehousLabel/findParams',
    method: 'get',
    params
  })
}
