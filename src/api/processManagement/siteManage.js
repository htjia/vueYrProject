import request from '@/utils/request'

// 查询
export function siteList(params) {
  return request({
    url: '/gySite/list',
    method: 'get',
    params
  })
}

// 添加站点
export function add(params) {
  return request({
    url: '/gySite/add',
    method: 'post',
    data: params
  })
}

// 修改站点
export function update(params) {
  return request({
    url: '/gySite/update',
    method: 'put',
    data: params
  })
}

// 删除站点
export function remove(params) {
  return request({
    url: '/gySite/delete',
    method: 'delete',
    params
  })
}

