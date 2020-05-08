import request from '@/utils/request'

// 查询
export function queryShop(params) {
  return request({
    url: '/gyShop/query',
    method: 'get',
    params
  })
}

// 新增
export function addShop(params) {
  return request({
    url: '/gyShop/add',
    method: 'post',
    data: params
  })
}

// 修改
export function updateShop(params) {
  return request({
    url: '/gyShop/update',
    method: 'put',
    data: params
  })
}
// 删除
export function deleteShop(params) {
  return request({
    url: `/gyShop/${params.id}/delete`,
    method: 'get',
    params
  })
}
