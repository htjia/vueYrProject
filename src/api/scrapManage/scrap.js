import request from '@/utils/request'

// 待报废列表
export function queryPendingData(params) {
  return request({
    url: '/xpProductExceptionScrapController/queryPendingData',
    method: 'get',
    params
  })
}
// 报废列表
export function queryHasScrapped(params) {
  return request({
    url: '/xpProductExceptionScrapController/queryHasScrapped',
    method: 'get',
    params
  })
}
// 撤销
export function cancelPendingData(params) {
  return request({
    url: `/xpProductExceptionScrapController/${params.id}/cancelPendingData`,
    method: 'delete',
    params
  })
}
// 删除
export function deleteBill(params) {
  return request({
    url: `/xpProductExceptionScrapController/${params.id}/deleteBill`,
    method: 'delete',
    params
  })
}
// 获取报废单号
export function generateBillNo() {
  return request({
    url: '/xpProductExceptionScrapController/generateBillNo',
    method: 'get'
  })
}
// 提交报废
export function addBill(params) {
  return request({
    url: '/xpProductExceptionScrapController/addBill',
    method: 'post',
    data: params
  })
}
// 审核
export function review(params) {
  return request({
    url: '/xpProductExceptionScrapController/review',
    method: 'get',
    params
  })
}
// 处理报废
export function updateBill(params) {
  return request({
    url: '/xpProductExceptionScrapController/updateBill',
    method: 'post',
    data: params
  })
}
// 报废入库
export function receive(params) {
  return request({
    url: '/xpProductExceptionScrapController/receive',
    method: 'post',
    data: params
  })
}
// 详情
export function getHasScrapDetail(params) {
  return request({
    url: '/xpProductExceptionScrapController/getHasScrapDetail',
    method: 'get',
    params
  })
}
// 报废片库
export function pageList(params) {
  return request({
    url: '/xpStorehouseScrap/pageList',
    method: 'get',
    params
  })
}
// 报废片库
export function borrow(params) {
  return request({
    url: '/xpStorehouseScrap/borrow',
    method: 'post',
    data: params
  })
}
