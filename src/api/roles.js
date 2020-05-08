import request from '@/utils/request'

// 查询
export function roles(params) {
  return request({
    url: '/role/query',
    method: 'get',
    params
  })
}
// 查询
export function findTrees(params) {
  return request({
    url: '/department/findTree',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/role/update',
    method: 'post',
    data: params
  })
}
// 权限配置
export function addRights(params) {
  return request({
    url: '/role/rights-profile',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/role/${params}/delete`,
    method: 'delete'
  })
}
// 获取所有菜单列表
export function menus(params) {
  return request({
    url: '/Menu/list',
    method: 'get',
    params
  })
}
// 获取菜单树
export function findTree(params) {
  return request({
    url: '/Menu/findTree',
    method: 'get',
    params
  })
}
