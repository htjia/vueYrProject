import request from '@/utils/request'

// 查询
export function findTree(params) {
  return request({
    url: '/department/findTree',
    method: 'get',
    params
  })
}

// 查询
export function getList(params) {
  return request({
    url: '/department/find',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/department/save',
    method: 'post',
    data: params
  })
}

// 删除用户
export function remove(params) {
  return request({
    url: '/department/delete',
    method: 'delete',
    params
  })
}

