import request from '@/utils/request'

// 查询
export function queryCraft(params) {
  return request({
    url: '/gy-craft/query',
    method: 'get',
    params
  })
}

// 新增
export function addCraft(params) {
  return request({
    url: '/gy-craft/add',
    method: 'post',
    data: params
  })
}

// 修改
export function updateCraft(params) {
  return request({
    url: '/gy-craft/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteCraft(params) {
  return request({
    url: `/gy-craft/${params.id}/delete`,
    method: 'get',
    params
  })
}
