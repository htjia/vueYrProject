import request from '@/utils/request'

// 列表
export function findList(params) {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params
  })
}
export function findLists() {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 用户列表
export function userList() {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 车间管理
export function gyShopList() {
  return request({
    url: '/gyShop/query',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 工序管理
export function processList(params) {
  return request({
    url: '/gy-process/query',
    method: 'get',
    params: params
  })
}
// 站点管理
export function siteList() {
  return request({
    url: '/gySite/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 新增
export function insert(params) {
  return request({
    url: '/xp-Machine/insert',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/xp-Machine/update',
    method: 'put',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: '/xp-Machine/delete',
    method: 'delete',
    params
  })
}
