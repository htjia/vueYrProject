import request from '@/utils/request'

// 测试代办列表
export function testingTicket(params) {
  return request({
    url: '/wy-visual-inspection/testing-ticket',
    method: 'get',
    params
  })
}

// 机台管理
export function matfindList() {
  return request({
    url: '/wyMachine/findList',
    method: 'get'
  })
}
// 炉号管理
export function furnacefindAll(params) {
  return request({
    url: '/wyStove/findAll',
    method: 'get',
    params
  })
}

// 开始目检
export function add(params) {
  return request({
    url: '/wy-visual-inspection/add',
    method: 'post',
    data: params
  })
}

// 目检等级
export function levelQuery(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 目检原因
export function reasonQuery(params) {
  return request({
    url: '/wy-visual-reason/queryList',
    method: 'get',
    params
  })
}
