import request from '@/utils/request'

// 查询
export function queryColorModel(params) {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params
  })
}

// 新增
export function addColorModel(params) {
  return request({
    url: '/gyModelColor/insert',
    method: 'post',
    data: params
  })
}

// 修改
export function updateColorModel(params) {
  return request({
    url: '/gyModelColor/update',
    method: 'put',
    data: params
  })
}
// 删除
export function deleteColorModel(params) {
  return request({
    url: `/gyModelColor/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 查询
export function queryColor(params) {
  return request({
    url: '/gyColor/list',
    method: 'get',
    params
  })
}

// 新增
export function addColor(params) {
  return request({
    url: '/gyColor/insert',
    method: 'post',
    data: params
  })
}

// 修改
export function updateColor(params) {
  return request({
    url: '/gyColor/update',
    method: 'put',
    data: params
  })
}
// 删除
export function deleteColor(params) {
  return request({
    url: `/gyColor/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
