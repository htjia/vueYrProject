import request from '@/utils/request'

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
export function findList(params) {
  return request({
    url: '/xpWarehous/find',
    method: 'get',
    params
  })
}
// wafer
export function findDetail(params) {
  return request({
    url: '/xpWarehous/findDetail',
    method: 'get',
    params
  })
}
// wafer扫描
export function findWaitStoreWafer(params) {
  return request({
    url: '/xpWarehous/findWaitStoreWafer',
    method: 'get',
    params
  })
}
// 新增
export function inserts(params) {
  return request({
    url: '/xpWarehous/insert',
    method: 'post',
    data: params
  })
}
// 自增单号
export function findCode(params) {
  return request({
    url: '/xpWarehous/findCode',
    method: 'get',
    params
  })
}
// bin列表
export function binFind() {
  return request({
    url: '/xpFullBinConfig/find',
    method: 'get'
  })
}
// bin新增
export function binInsert(params) {
  return request({
    url: '/xpFullBinConfig/insert',
    method: 'post',
    data: params
  })
}
// bin修改
export function binUpdate(params) {
  return request({
    url: '/xpFullBinConfig/update',
    method: 'put',
    data: params
  })
}
// bin删除
export function binDeletes(params) {
  return request({
    url: `/xpFullBinConfig/${params.id}/delete`,
    method: 'delete'
  })
}
// bin删除
export function wagerDeletes(params) {
  return request({
    url: `/xpWarehous/${params.id}/delete`,
    method: 'delete'
  })
}
// 分包列表
export function fbFind() {
  return request({
    url: '/xpBandConfig/find',
    method: 'get'
  })
}
// 分包新增
export function fbInsert(params) {
  return request({
    url: '/xpBandConfig/insert',
    method: 'post',
    data: params
  })
}
// 修改
export function updateWafer(params) {
  return request({
    url: '/xpWarehous/updateWafer',
    method: 'get',
    params
  })
}
// 打印
export function printLable(params) {
  return request({
    url: '/xpWarehous/printLable',
    method: 'post',
    data: params
  })
}
export function updateRefuseWafer(params) {
  return request({
    url: '/xpWarehous/update',
    method: 'post',
    data: params
  })
}
