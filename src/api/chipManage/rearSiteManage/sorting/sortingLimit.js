import request from '@/utils/request'
// 查询全部
export function findAll(params) {
  return request({
    url: '/xpSortingLimit/findAll',
    method: 'get',
    params
  })
}
// 批量查询
export function mulFind(params) {
  return request({
    url: '/xpSortingLimit/mulFind',
    method: 'get',
    params
  })
}

// 批量添加
export function mulAdd(params) {
  return request({
    url: '/xpSortingLimit/mulAdd',
    method: 'post',
    params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/xpSortingLimit/update',
    method: 'post',
    params
  })
}
// 删除
export function remove(params) {
  return request({
    url: '/xpSortingLimit/delete',
    method: 'post',
    params
  })
}
