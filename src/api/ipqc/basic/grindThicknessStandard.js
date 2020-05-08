import request from '@/utils/request'

// 查询
export function getList() {
  return request({
    url: '/zlGrindNormController/zlGrindNormFindAll',
    method: 'get'
  })
}
// 修改
export function updateList(params) {
  return request({
    url: '/zlGrindNormController/zlGrindNormPut',
    method: 'put',
    data: params
  })
}
