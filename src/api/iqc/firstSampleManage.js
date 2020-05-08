import request from '@/utils/request'

// 新增
export function add(params) {
  return request({
    url: '/zlFirstSample/add',
    method: 'post',
    data: params
  })
}
// 编辑
export function edit(params) {
  return request({
    url: '/zlFirstSample/editor',
    method: 'put',
    data: params
  })
}
// 批量验证
export function addBatchSample(params) {
  return request({
    url: '/zlFirstSample/addBatchSample',
    method: 'post',
    data: params
  })
}
// 初次试样
export function addFirstSample(params) {
  return request({
    url: '/zlFirstSample/addFirstSample',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: '/zlFirstSample/delete',
    method: 'delete',
    params
  })
}
// 编辑批量验证
export function editorBatchSample(params) {
  return request({
    url: '/zlFirstSample/editorBatchSample',
    method: 'put',
    data: params
  })
}
// 编辑初次试样
export function editorFirstSample(params) {
  return request({
    url: '/zlFirstSample/editorFirstSample',
    method: 'put',
    data: params
  })
}
// 获取单号
export function getSampleNo(params) {
  return request({
    url: '/zlFirstSample/getSampleNo',
    method: 'get',
    params
  })
}
// 查询
export function queryList(params) {
  return request({
    url: '/zlFirstSample/query',
    method: 'get',
    params
  })
}
// 试样类型
export function getSampleType(params) {
  return request({
    url: '/zlFirstSample/getSampleType',
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

