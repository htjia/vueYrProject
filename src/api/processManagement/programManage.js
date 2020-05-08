import request from '@/utils/request'

// 查询
export function queryProgram(params) {
  return request({
    url: '/gyProgram/query',
    method: 'get',
    params
  })
}
// 新增
export function addProgram(params) {
  return request({
    url: '/gyProgram/add',
    method: 'post',
    data: params
  })
}

// 修改
export function updateProgram(params) {
  return request({
    url: '/gyProgram/update',
    method: 'put',
    data: params
  })
}
// 删除
export function deleteProgram(params) {
  return request({
    url: `/gyProgram/${params.id}/delete`,
    method: 'get',
    params
  })
}
// 工序管理
export function processList(params) {
  return request({
    url: '/gy-process/query',
    method: 'get',
    params: params
  })
}
