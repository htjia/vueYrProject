import request from '@/utils/request'

// 衬底尺寸
export function findSubstrateMeasureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 产品管理
export function productList() {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get'
  })
}
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
    url: '/xp-grinding-craft/query-list',
    method: 'get',
    params
  })
}
// 新增
export function add(params) {
  return request({
    url: '/xp-grinding-craft/add',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/xp-grinding-craft/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: `/xp-grinding-craft/${params.id}/delete`,
    method: 'delete',
    params
  })
}
