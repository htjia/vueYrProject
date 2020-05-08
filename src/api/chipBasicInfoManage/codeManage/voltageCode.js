import request from '@/utils/request'

// 列表
export function queryList(params) {
  return request({
    url: '/xp-voltage/query-list',
    method: 'get',
    params
  })
}
export function queryLists(params) {
  return request({
    url: '/xp-voltage/query-list',
    method: 'get',
    params
  })
}
// 新增详细
export function addDetail(params) {
  return request({
    url: '/xp-voltage/add',
    method: 'post',
    data: params
  })
}
// 修改详细
export function updateDetail(params) {
  return request({
    url: '/xp-voltage/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteDetail(params) {
  return request({
    url: `/xp-voltage/${params.id}/delete`,
    method: 'delete',
    params
  })
}
