import request from '@/utils/request'

// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
// 型号管理
export function findModelList() {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 列表
export function findList(params) {
  return request({
    url: '/xpCotCenterNorm/find',
    method: 'get',
    params
  })
}
// 新增
export function save(params) {
  return request({
    url: '/xpCotCenterNorm/save',
    method: 'post',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: '/xpCotCenterNorm/delete',
    method: 'delete',
    params
  })
}
// 启用
export function disableEnable(params) {
  return request({
    url: '/xpCotCenterNorm/disableEnable',
    method: 'post',
    params
  })
}
