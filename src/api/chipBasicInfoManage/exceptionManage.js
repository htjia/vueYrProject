import request from '@/utils/request'

// 列表
export function findList(params) {
  return request({
    url: '/xp-abnormal-classification/query-list',
    method: 'get',
    params
  })
}
// 新增
export function save(params) {
  return request({
    url: '/xp-abnormal-classification/add',
    method: 'post',
    data: params
  })
}
// 新增
export function update(params) {
  return request({
    url: '/xp-abnormal-classification/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: `/xp-abnormal-classification/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 启用
export function disableEnable(params) {
  return request({
    url: '/xp-abnormal-classification/enable-disable',
    method: 'get',
    params
  })
}
