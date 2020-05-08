import request from '@/utils/request'

// 列表查询
export function findList(params) {
  return request({
    url: '/xpSortingDispatch/find',
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
// 客户列表
export function customerList() {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      siteId: 31
    }
  })
}
// 调度
export function dispatch(params) {
  return request({
    url: '/xpSortingDispatch/dispatch',
    method: 'post',
    params
  })
}
