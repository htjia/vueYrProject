import request from '@/utils/request'

// 查询
export function findCode(params) {
  return request({
    url: '/ckProduceBack/findCode',
    method: 'get',
    params
  })
}
// 查询退库类型
export function findType(params) {
  return request({
    url: '/ckBackhouseType/findList',
    method: 'get',
    params
  })
}
// 查询list
export function findWaitBackWafer(params) {
  return request({
    url: '/ckStorehouse/findStoreHouseDetail',
    method: 'get',
    params
  })
}
// 添加
export function insert(params) {
  return request({
    url: '/ckProduceBack/insert',
    method: 'post',
    data: params
  })
}
// 退库单数据
export function pageList(params) {
  return request({
    url: '/ckProduceBack/pageList',
    method: 'get',
    params
  })
}
// 退库单数据wafer
export function findBackDetail(params) {
  return request({
    url: '/ckProduceBack/findProduceBackDetail',
    method: 'get',
    params
  })
}
