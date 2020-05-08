import request from '@/utils/request'

// 客户列表
export function customerList() {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 列表查询
export function queryList(params) {
  return request({
    url: '/xp-grinding-platter/query-list',
    method: 'get',
    params
  })
}
// 新增
export function add(params) {
  return request({
    url: '/xp-grinding-platter/add',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/xp-grinding-platter/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: `/xp-grinding-platter/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 条码
export function barCode(params) {
  return request({
    url: '/scProduceTask/findBarcode',
    method: 'post',
    data: params
  })
}
// 打印
export function printLabel(params) {
  return request({
    url: '/print/printLabel',
    method: 'post',
    data: params
  })
}
// 盘类型
export function getGrindingPlatterTypeList(params) {
  return request({
    url: '/XpGrindingPlatterTypeController/getGrindingPlatterTypeList',
    method: 'get',
    params
  })
}
// 条码打印
export function printList(params) {
  return request({
    url: '/xp-grinding-platter/printList',
    method: 'get',
    params
  })
}
