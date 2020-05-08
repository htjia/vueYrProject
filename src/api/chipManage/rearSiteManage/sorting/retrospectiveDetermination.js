import request from '@/utils/request'

// 产品代码
export function scProductModel() {
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
// 设置列表
export function setList(params) {
  return request({
    url: '/xpBackTestNorm/find',
    method: 'get',
    params
  })
}
// 设置列表
export function findField(params) {
  return request({
    url: '/xpBackTestNorm/findField',
    method: 'get',
    params
  })
}
// 找详情
export function backFind(params) {
  return request({
    url: '/xpBackTest/find',
    method: 'get',
    params
  })
}
// 阈值列表
export function findAnalysis(params) {
  return request({
    url: '/xpBackTestNorm/findAnalysis',
    method: 'get',
    params
  })
}
// 设置列表修改
export function setSave(params) {
  return request({
    url: '/xpBackTestNorm/save',
    method: 'post',
    data: params
  })
}
// 阈值列表修改
export function updateAnalysis(params) {
  return request({
    url: '/xpBackTestNorm/updateAnalysis',
    method: 'post',
    data: params
  })
}
// 回测记录
export function findRecord(params) {
  return request({
    url: '/xpBackTest/findRecord',
    method: 'get',
    params
  })
}
// bin查询
export function findBinField() {
  return request({
    url: '/xpBackTestNorm/findBinField',
    method: 'get'
  })
}
export function insertBinField(params) {
  return request({
    url: '/xpBackTestNorm/insertBinField',
    method: 'post',
    params
  })
}
