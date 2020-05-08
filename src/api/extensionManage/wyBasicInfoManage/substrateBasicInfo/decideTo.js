import request from '@/utils/request'

// 判断指向查询
export function findDecide(params) {
  return request({
    url: '/wyDecide/find',
    method: 'get',
    params
  })
}
// 修改状态
export function updateDecide(params) {
  return request({
    url: '/wyDecide/disableEnable',
    method: 'post',
    params
  })
}

