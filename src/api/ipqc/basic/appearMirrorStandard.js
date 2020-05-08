import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/zlFacaeNorm/pageList',
    method: 'get',
    params
  })
}
// 查询
export function getNumList() {
  return request({
    url: '/zlFacaeNorm/findNum',
    method: 'get'
  })
}
// 添加
export function addList(params) {
  return request({
    url: '/zlFacaeNorm/insert',
    method: 'post',
    data: params
  })
}
// 修改
export function updateList(params) {
  return request({
    url: '/zlFacaeNorm/update',
    method: 'put',
    data: params
  })
}
// 修改状态
export function updateByStatus(params) {
  return request({
    url: '/zlFacaeNorm/updateByStatus',
    method: 'put',
    data: params
  })
}
// 修改排序
export function updateSequence(params) {
  return request({
    url: '/zlFacaeNorm/updateSequence',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/zlFacaeNorm/${params.id}/delete`,
    method: 'get'
  })
}
// 修改配置
export function updateNum(params) {
  return request({
    url: '/zlFacaeNorm/updateNum',
    method: 'put',
    params
  })
}
