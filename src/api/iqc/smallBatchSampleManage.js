import request from '@/utils/request'

// 查询
export function findList(params) {
  return request({
    url: '/zlSample/query',
    method: 'get',
    params
  })
}
// 查询部门
export function findDepartment(params) {
  return request({
    url: '/department/query',
    method: 'get',
    params
  })
}
// 新增
export function insert(params) {
  return request({
    url: '/zlSample/add',
    method: 'post',
    data: params
  })
}
// 小批量试样编号
export function getSampleNo(params) {
  return request({
    url: '/zlSample/getSampleNo',
    method: 'get',
    params
  })
}
// 编辑
export function edit(params) {
  return request({
    url: '/zlSample/edtior',
    method: 'put',
    data: params
  })
}
// 接收
export function receive(params) {
  return request({
    url: '/zlSample/receive',
    method: 'put',
    params
  })
}
// 删除
export function remove(params) {
  return request({
    url: '/zlSample/delete',
    method: 'delete',
    params
  })
}
// 查询user
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

