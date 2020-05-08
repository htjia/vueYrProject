import request from '@/utils/request'
// ----------------材料--start------------------
// 新增
export function materialAdd(params) {
  return request({
    url: '/zlMaterial/add',
    method: 'post',
    data: params
  })
}
// 删除
export function materialDelete(params) {
  return request({
    url: '/zlMaterial/delete',
    method: 'delete',
    params
  })
}
// 修改状态
export function materialUpdate(params) {
  return request({
    url: '/zlMaterial/enableOrDisable',
    method: 'put',
    params
  })
}
// 根据类型查询材料
export function getMaterialByType(params) {
  return request({
    url: '/zlMaterial/getMaterialByType',
    method: 'get',
    params
  })
}

// 查询材料
export function materialQuery(params) {
  return request({
    url: '/zlMaterial/query',
    method: 'get',
    params
  })
}
// ----------------材料--end------------------
// ----------------型号规格--start------------------
// 新增
export function specificationsAdd(params) {
  return request({
    url: '/zlSpecifications/add',
    method: 'post',
    data: params
  })
}
// 删除
export function specificationsDelete(params) {
  return request({
    url: '/zlSpecifications/delete',
    method: 'delete',
    params
  })
}
// 修改状态
export function specificationsUpdate(params) {
  return request({
    url: '/zlSpecifications/enableOrDisable',
    method: 'put',
    params
  })
}
// 查询
export function specificationsQuery(params) {
  return request({
    url: '/zlSpecifications/query',
    method: 'get',
    params
  })
}
// ----------------型号规格--end------------------
// ----------------单位--start------------------
// 新增
export function unitAdd(params) {
  return request({
    url: '/zlUnit/add',
    method: 'post',
    data: params
  })
}
// 删除
export function unitDelete(params) {
  return request({
    url: '/zlUnit/delete',
    method: 'delete',
    params
  })
}
// 修改状态
export function unitUpdate(params) {
  return request({
    url: '/zlUnit/enableOrDisable',
    method: 'put',
    params
  })
}
// 查询
export function unitQuery(params) {
  return request({
    url: '/zlUnit/query',
    method: 'get',
    params
  })
}
// ----------------单位--end------------------
// ----------------年限--start------------------
// 新增
export function yearAdd(params) {
  return request({
    url: '/zlYear/add',
    method: 'post',
    data: params
  })
}
// 删除
export function yearDelete(params) {
  return request({
    url: '/zlYear/delete',
    method: 'delete',
    params
  })
}
// 修改状态
export function yearUpdate(params) {
  return request({
    url: '/zlYear/enableOrDisable',
    method: 'put',
    params
  })
}
// 查询
export function yearQuery(params) {
  return request({
    url: '/zlYear/query',
    method: 'get',
    params
  })
}
// ----------------年限--end------------------
// ----------------过期提醒--start------------------
// 编辑
export function overdueConfigUpdate(params) {
  return request({
    url: '/zlOverdueConfig/editor',
    method: 'put',
    params
  })
}
// 查询
export function overdueConfigQuery(params) {
  return request({
    url: '/zlOverdueConfig/query',
    method: 'get',
    params
  })
}
// ----------------过期提醒--end------------------
