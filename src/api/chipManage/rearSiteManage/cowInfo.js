import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/scProduceTask/find',
    method: 'get',
    params
  })
}
// 外延机台
export function machineList(params) {
  return request({
    url: '/wyMachine/findList',
    method: 'get',
    params
  })
}
// 产品代码
export function findProductCode(params) {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get',
    params
  })
}
// 衬底尺寸
export function findSubstrateMeasureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 衬底尺寸
export function findCategoryList(params) {
  return request({
    url: '/scCategory/findSelect',
    method: 'get',
    params
  })
}

// 查询
export function getCowList(params) {
  return request({
    url: '/xp-cow-test/query-cow-list',
    method: 'get',
    params
  })
}
// 查询机台
export function findMachinList(params) {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params
  })
}
// 批量查询
export function mulFind(params) {
  return request({
    url: '/xp-cow-test/mulFind',
    method: 'get',
    params
  })
}

