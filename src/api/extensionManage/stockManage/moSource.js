import request from '@/utils/request'

// 机台查询
export function findMoList(params) {
  return request({
    url: '/wyMoConfig/findList',
    method: 'get',
    params
  })
}
// 新增
export function insert(params) {
  return request({
    url: '/wyMoConfig/insert',
    method: 'post',
    data: params
  })
}
// RunID查询
export function findRunList(params) {
  return request({
    url: '/wyMoConfig/findRunList',
    method: 'get',
    params
  })
}
// 旧瓶信息查询
export function findOldInfo(params) {
  return request({
    url: '/wyMoConfig/queryById',
    method: 'get',
    params
  })
}
// 钢瓶使用记录查询
export function findBottleList(params) {
  return request({
    url: '/wyMoConfig/findBottleList',
    method: 'get',
    params
  })
}
// mo更换记录查询
export function moRecordList(params) {
  return request({
    url: '/wyMoConfig/moRecordList',
    method: 'get',
    params
  })
}
// mo更换
export function insertMoRecord(params) {
  return request({
    url: '/wyMoConfig/insertMoRecord',
    method: 'post',
    data: params
  })
}
