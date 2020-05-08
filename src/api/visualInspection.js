import request from '@/utils/request'

// 原因列表
export function reasonList(params) {
  return request({
    url: '/wy-visual-reason/queryList',
    method: 'get',
    params
  })
}

// 等级列表
export function levelList(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 原因新增
export function reasonAdd(params) {
  return request({
    url: '/wy-visual-reason/add',
    method: 'post',
    data: params
  })
}
// 等级新增
export function levelAdd(params) {
  return request({
    url: '/wy-visual-level/add',
    method: 'post',
    data: params
  })
}
// 原因修改
export function reasonUpdate(params) {
  return request({
    url: '/wy-visual-reason/update',
    method: 'post',
    data: params
  })
}
// 等级修改
export function levelUpdate(params) {
  return request({
    url: '/wy-visual-level/update',
    method: 'post',
    data: params
  })
}
// 原因删除
export function reasonDelete(params) {
  return request({
    url: `/wy-visual-reason/${params.id}/delete`,
    method: 'get',
    params
  })
}
// 等级删除
export function levelDelete(params) {
  return request({
    url: `/wy-visual-level/${params.id}/delete`,
    method: 'get',
    params
  })
}

// 目检结果删除
export function deleteController(params) {
  return request({
    url: '/yrWyVisualResultController/deleteFake',
    method: 'delete',
    params
  })
}
// 查询每个尺寸下的目检关系
export function visualRefList(params) {
  return request({
    url: '/wy-visual-level/visualRefList',
    method: 'get',
    params
  })
}
// 添加目检结果目检尺寸关系
export function addRefVisualAndResult(params) {
  return request({
    url: '/wy-visual-level/addRefVisualAndResult',
    method: 'get',
    params
  })
}
// 更新目检与目检结果关系
export function updateRefVisual(params) {
  return request({
    url: '/wy-visual-level/updateRefVisual',
    method: 'get',
    params
  })
}
// 目检结果新增
export function createController(params) {
  return request({
    url: '/yrWyVisualResultController/save',
    method: 'post',
    data: params
  })
}

// 目检结果修改
export function editController(params) {
  return request({
    url: '/yrWyVisualResultController/update',
    method: 'post',
    data: params
  })
}
// 修改
export function updateItem(params) {
  return request({
    url: '/wy-visual-level/update',
    method: 'post',
    data: params
  })
}
// 目检结果查询
export function findController(params) {
  return request({
    url: '/yrWyVisualResultController/find',
    method: 'get',
    params
  })
}
export function updateQuickSearch(params) {
  return request({
    url: '/wy-visual-level/updateQuickSearch',
    method: 'get',
    params
  })
}
