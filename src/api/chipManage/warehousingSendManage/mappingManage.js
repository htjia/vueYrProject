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
    url: '/xpMapping/find',
    method: 'get',
    params
  })
}
// wafer
export function findDetail(params) {
  return request({
    url: '/xpMapping/findDetail',
    method: 'get',
    params
  })
}
// 新增
export function inserts(params) {
  return request({
    url: '/xpMapping/insert',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/xpMapping/update',
    method: 'put',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: `/xpMapping/${params.id}/delete`,
    method: 'delete',
    params
  })
}
