import request from '@/utils/request'

// 查询
export function findList(params) {
  return request({
    url: '/xpWarehous/find',
    method: 'get',
    params
  })
}
// 查询Wafer
export function findWafer(params) {
  return request({
    url: '/xpWarehous/findDetail',
    method: 'get',
    params
  })
}
// 产品管理
export function productList(params) {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get',
    params
  })
}
// 异常缺陷查询
export function findAbnormal(params) {
  return request({
    url: '/zlPackageConfig/findSelect',
    method: 'get',
    params
  })
}

// 获取判定规则
export function findNormByState(params) {
  return request({
    url: '/zlInputNorm/findNormByState',
    method: 'get',
    params
  })
}
// 自动审核
export function ypAutoCheck(params) {
  return request({
    url: '/xpWarehous/ypAutoCheck',
    method: 'post',
    params
  })
}
// 方片回测判定
export function fpAutoCheck(params) {
  return request({
    url: '/xpWarehous/fpAutoCheck',
    method: 'post',
    params
  })
}

// 判定提交
export function audit(params) {
  return request({
    url: '/xpWarehous/audit',
    method: 'post',
    data: params
  })
}
// 反审
export function reverseAduit(params) {
  return request({
    url: '/xpWarehous/reverseAduit',
    method: 'post',
    params
  })
}
