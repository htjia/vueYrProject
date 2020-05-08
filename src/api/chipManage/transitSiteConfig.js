import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/xp-processManage/query',
    method: 'get',
    params
  })
}
// 查询所有工序
export function nextProcessList(params) {
  return request({
    url: '/xp-processManage/nextProcessList',
    method: 'get',
    params
  })
}
// 查询对应站点工序
export function nowProcessList(params) {
  return request({
    url: '/xp-processManage/nowProcessList',
    method: 'get',
    params
  })
}
// 配置站点
export function update(params) {
  return request({
    url: '/xp-processManage/update',
    method: 'put',
    data: params
  })
}
// 查询车间
export function findShopList(params) {
  return request({
    url: '/gyShop/query',
    method: 'get',
    params
  })
}
// 查询车间
export function findSiteList(params) {
  return request({
    url: '/xp-processManage/querySiteList',
    method: 'get',
    params
  })
}
// 查询工序对应的异常配置
export function exceptQuery(params) {
  return request({
    url: '/xp-processManage/exceptQuery',
    method: 'get',
    params
  })
}
// 查询程序
export function findProgram(params) {
  return request({
    url: '/gyProgram/findSelect',
    method: 'get',
    params
  })
}
// 异常配置
export function exceptConfig(params) {
  return request({
    url: '/xp-processManage/exceptConfig',
    method: 'post',
    data: params
  })
}
