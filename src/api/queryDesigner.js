import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/sys-select/query',
    method: 'get',
    params
  })
}

// 查询内容
export function getListContent(params) {
  return request({
    url: '/Sys-select-content/query',
    method: 'get',
    params
  })
}

// 查询条件
export function getListCondition(params) {
  return request({
    url: '/sys-select-condition/query',
    method: 'get',
    params
  })
}

// 查询限制
export function getListAstrict(params) {
  return request({
    url: '/sys-select-astrict/query',
    method: 'get',
    params
  })
}

// 查询数据预览
// export function getListAstrict(params) {
//   request({
//     url: '/sys-select/select-data',
//     method: 'get',
//     params
//   })
// }
// 查询数据查看
export function getListPreview(params) {
  return request({
    url: '/sys-select/select-data',
    method: 'get',
    params
  })
}

// 删除
export function remove(id) {
  return request({
    url: `/sys-select/${id}/delete`,
    method: 'get'
  })
}

// 查询树
export function findTree() {
  return request({
    url: '/metaSource/findTree',
    method: 'get'
  })
}

// 数据修改
export function selectUpdate(params) {
  return request({
    url: '/sys-select/update',
    method: 'post',
    data: params
  })
}

// 数据添加
export function selectAdd(params) {
  return request({
    url: '/sys-select/add',
    method: 'post',
    data: params
  })
}

// 内容删除
export function contentDelete(params) {
  return request({
    url: `/Sys-select-content/{id}/delete`,
    method: 'get',
    params
  })
}

// 内容添加
export function contentAdd(params) {
  return request({
    url: '/Sys-select-content/add',
    method: 'post',
    data: params
  })
}

// 内容修改
export function contentUpdate(params) {
  return request({
    url: '/Sys-select-content/update',
    method: 'post',
    data: params
  })
}

// 条件删除
export function conditionDelete(params) {
  return request({
    url: `/sys-select-condition/{id}/delete`,
    method: 'get',
    params
  })
}

// 条件添加
export function conditionAdd(params) {
  return request({
    url: '/sys-select-condition/add',
    method: 'post',
    data: params
  })
}

// 条件修改
export function conditionUpdate(params) {
  return request({
    url: '/sys-select-condition/update',
    method: 'post',
    data: params
  })
}

// 限制删除
export function astrictDelete(params) {
  return request({
    url: `/sys-select-astrict/{id}/delete`,
    method: 'get',
    params
  })
}

// 限制添加
export function astrictAdd(params) {
  return request({
    url: '/sys-select-astrict/add',
    method: 'post',
    data: params
  })
}

// 限制修改
export function astrictUpdate(params) {
  return request({
    url: '/sys-select-astrict/update',
    method: 'post',
    data: params
  })
}

// 数据预览
export function dataPreview(params) {
  return request({
    url: '/sys-select/data-preview',
    method: 'post',
    data: params
  })
}
