import request from '@/utils/request'

// 查询
export function queryList(params) {
  return request({
    url: '/scMonthPlan/query',
    method: 'get',
    params
  })
}

// 获取柱状图
export function getProductSchedule(params) {
  return request({
    url: '/scMonthPlan/getProductSchedule',
    method: 'get',
    params
  })
}

// 新增
export function addMonthPlan(params) {
  return request({
    url: '/scMonthPlan/addMonthPlan',
    method: 'post',
    data: params
  })
}

// 产品列表
export function getProductType(params) {
  return request({
    url: '/scMonthPlan/getProductType',
    method: 'get',
    params
  })
}
// 类型列表
export function getProductModel() {
  return request({
    url: '/scMonthPlan/getProductModel',
    method: 'get'
  })
}

// 衬底列表
export function getChenDi() {
  return request({
    url: '/scMonthPlan/findChenDi',
    method: 'get'
  })
}

// 获取已有月度计划的月份
export function getPlanMonth(params) {
  return request({
    url: '/scMonthPlan/getPlanMonth',
    method: 'get',
    params
  })
}

// 修改
export function changeMonthPlan(params) {
  return request({
    url: '/scMonthPlan/editor',
    method: 'put',
    data: params
  })
}

// 取消投产
export function cancelTc(params) {
  return request({
    url: '/scMonthPlan/cancellation',
    method: 'put',
    params
  })
}

// 恢复投产
export function recoverTc(params) {
  return request({
    url: '/scMonthPlan/recover',
    method: 'put',
    params
  })
}

// 更新日志
export function changeLog(params) {
  return request({
    url: '/scMonthPlan/changeLog',
    method: 'get',
    params
  })
}

