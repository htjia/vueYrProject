import request from '@/utils/request'

// 查询
export function getList() {
  return request({
    url: '/zlTeamConfigController/find',
    method: 'get'
  })
}
// 新增项目
export function addList(param) {
  return request({
    url: '/zlTeamConfigController/save',
    method: 'post',
    data: param
  })
}
// 删除
export function deleteList(params) {
  return request({
    url: '/zlTeamConfigController/delete',
    method: 'delete',
    params
  })
}
// 修改
export function updateSequence(params) {
  return request({
    url: '/zlTeamConfigController/updateSequence',
    method: 'post',
    data: params
  })
}
