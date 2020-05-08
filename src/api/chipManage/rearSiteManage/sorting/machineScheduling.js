import request from '@/utils/request'

// 列表查询
export function findList(params) {
  return request({
    url: '/xpMachineDispatch/find',
    method: 'get',
    params
  })
}
// 机台信息
export function findMachineList() {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      siteId: 31
    }
  })
}
// 产品管理
export function productList() {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get'
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
// 工艺管理
export function findGYList() {
  return request({
    url: '/gy-craft/query',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 列表查询
export function findBinList(params) {
  return request({
    url: '/xpMachineDispatch/findBinVersion',
    method: 'get',
    params
  })
}
// 机台信息
export function cotfindMachineList() {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      siteId: 28
    }
  })
}
// 保存
export function save(params) {
  return request({
    url: '/xpMachineDispatch/save',
    method: 'post',
    data: params
  })
}
