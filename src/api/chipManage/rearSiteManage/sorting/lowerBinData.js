import request from '@/utils/request'

// 列表查询
export function findList(params) {
  return request({
    url: '/xpDownBin/find',
    method: 'get',
    params
  })
}
// 批量查询
export function mulFind(params) {
  return request({
    url: '/xpDownBin/mulFind',
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
// 母片详情
export function findMather(params) {
  return request({
    url: '/xpDownBin/findMather',
    method: 'get',
    params
  })
}

