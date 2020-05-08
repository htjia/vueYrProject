import request from '@/utils/request'

// 测试代办列表
export function willingTestingTicket(params) {
  return request({
    url: '/wy-visual-inspection/willing-testing-ticket',
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
