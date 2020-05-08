import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/zlCraftNorm/pageList',
    method: 'get',
    params
  })
}
// 添加
export function addList(params) {
  return request({
    url: '/zlCraftNorm/insert',
    method: 'post',
    data: params
  })
}
// 修改
export function updateList(params) {
  return request({
    url: '/zlCraftNorm/update',
    method: 'put',
    data: params
  })
}
// 修改状态
export function updateByStatus(params) {
  return request({
    url: '/zlCraftNorm/updateByStatus',
    method: 'put',
    data: params
  })
}
// 修改排序
export function updateSequence(params) {
  return request({
    url: '/zlCraftNorm/updateSequence',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/zlCraftNorm/${params.id}/delete`,
    method: 'get'
  })
}
