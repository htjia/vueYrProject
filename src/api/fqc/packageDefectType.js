import request from '@/utils/request'

// 查询
export function findList(params) {
  return request({
    url: '/zlPackageConfig/find',
    method: 'get',
    params
  })
}
// 新增
export function insert(params) {
  return request({
    url: '/zlPackageConfig/insert',
    method: 'post',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/zlPackageConfig/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 修改
export function update(params) {
  return request({
    url: `/zlPackageConfig/update`,
    method: 'put',
    data: params
  })
}
