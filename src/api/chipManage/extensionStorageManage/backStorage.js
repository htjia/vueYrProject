import request from '@/utils/request'

// 查询
export function findCode(params) {
  return request({
    url: '/ckBack/findCode',
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
    url: '/ckBack/findWaitBackWafer',
    method: 'get',
    params
  })
}
// 重新分配盒号
export function createBoxNo(params) {
  return request({
    url: '/ckBack/createBoxNo',
    method: 'post',
    data: params
  })
}
// 重新分配盒号
export function insert(params) {
  return request({
    url: '/ckBack/insert',
    method: 'post',
    data: params
  })
}
// 退库单数据
export function pageList(params) {
  return request({
    url: '/ckBack/pageList',
    method: 'get',
    params
  })
}
// 退库单数据wafer
export function findBackDetail(params) {
  return request({
    url: '/ckBack/findBackDetail',
    method: 'get',
    params
  })
}
// 打印
export function printLabel(params) {
  return request({
    url: '/ckBack/printLabel',
    method: 'post',
    params
  })
}
