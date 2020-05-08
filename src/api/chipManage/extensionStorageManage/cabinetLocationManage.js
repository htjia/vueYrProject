import request from '@/utils/request'

// wafer查询
export function findWaferByArk(params) {
  return request({
    url: '/ckStorehouse/findWaferByArk',
    method: 'get',
    params
  })
}
// 柜位查询
export function findList(params) {
  return request({
    url: '/ckArk/findList',
    method: 'get',
    params
  })
}
// 柜位新增
export function insert(params) {
  return request({
    url: '/ckArk/insert',
    method: 'post',
    data: params
  })
}
// 柜位编辑
export function update(params) {
  return request({
    url: '/ckArk/update',
    method: 'put',
    data: params
  })
}
// 柜位调整
export function updateArk(params) {
  return request({
    url: '/ckStorehouse/updateArk',
    method: 'post',
    params
  })
}
// 柜位删除
export function deleteArk(params) {
  return request({
    url: `ckArk/${params.id}/delete`,
    method: 'delete',
    params
  })
}
