import request from '@/utils/request'

// 查询
export function queryAll(params) {
  return request({
    url: '/wy-data-maintain/query',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/wy-data-maintain/add',
    method: 'post',
    data: params
  })
}

// 用户列表
export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
export function getlasermark(params) {
  return request({
    url: '/wy-data-maintain/get-laser-mark',
    method: 'get',
    params
  })
}

