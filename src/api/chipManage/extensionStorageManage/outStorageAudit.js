import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/scProduceTask/find',
    method: 'get',
    params
  })
}
// 查询wafer
export function findWafer(params) {
  return request({
    url: '/scOutgoing/findWafer',
    method: 'get',
    params
  })
}
// 审核(状态更改)
export function audit(params) {
  return request({
    url: '/scOutgoing/audit',
    method: 'post',
    params
  })
}

// 自动审核
export function autoCheck(params) {
  return request({
    url: '/scOutgoing/autoCheck',
    method: 'post',
    data: params
  })
}
