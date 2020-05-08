import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/ckStorehouse/findWaferByBox',
    method: 'get',
    params
  })
}
// 修改更新
export function updateBoxNo(params) {
  return request({
    url: '/ckStorehouse/updateBoxNo',
    method: 'post',
    data: params
  })
}
