import request from '@/utils/request'

// 衬底工艺查询
export function typeList(params) {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get',
    params
  })
}
// 衬底工艺查询所有
export function typePageList(params) {
  return request({
    url: '/wySubstrateType/pageList',
    method: 'get',
    params
  })
}
// 衬底类型查询所有
export function genrePageList(params) {
  return request({
    url: '/wySubstrateCraft/pageList',
    method: 'get',
    params
  })
}
// 衬底类型查询
export function genreFindList(params) {
  return request({
    url: '/wySubstrateCraft/findList',
    method: 'get',
    params
  })
}
// 衬底厂家查询
export function supplierList(params) {
  return request({
    url: '/wySupplier/findList',
    method: 'get',
    params
  })
}
// 衬底厂家查询所有
export function supplierPageList(params) {
  return request({
    url: '/wySupplier/pageList',
    method: 'get',
    params
  })
}

// 衬底尺寸代圈数查询
export function findMeasureAndCircle(params) {
  return request({
    url: '/wySubstrateMeasure/findMeasureAndCircle',
    method: 'get',
    params
  })
}

// 衬底尺寸查询
export function measureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 衬底尺寸查询所有
export function measurePageList(params) {
  return request({
    url: '/wySubstrateMeasure/pageList',
    method: 'get',
    params
  })
}

// 新增衬底工艺
export function addSubstrateType(params) {
  return request({
    url: '/wySubstrateType/insert',
    method: 'post',
    data: params
  })
}
// 新增衬底尺寸
export function addSubstrateMeasure(params) {
  return request({
    url: '/wySubstrateMeasure/insert',
    method: 'post',
    data: params
  })
}
// 新增供应商
export function addSupplier(params) {
  return request({
    url: '/wySupplier/insert',
    method: 'post',
    data: params
  })
}
// 新增衬底类型
export function addSubstrateGenre(params) {
  return request({
    url: '/wySubstrateCraft/insert',
    method: 'post',
    data: params
  })
}

// 删除衬底尺寸
export function deleteMeasure(params) {
  return request({
    url: `/wySubstrateMeasure/${params.id}/delete`,
    method: 'delete'
  })
}

// 删除衬底工艺
export function deleteType(params) {
  return request({
    url: `/wySubstrateType/${params.id}/delete`,
    method: 'delete'
  })
}

// 删除衬底供应商
export function deleteSupplier(params) {
  return request({
    url: `/wySupplier/${params.id}/delete`,
    method: 'delete'
  })
}

// 删除衬底类型
export function deleteGenre(params) {
  return request({
    url: `/wySubstrateCraft/${params.id}/delete`,
    method: 'delete'
  })
}
// 修改衬底供应商
export function updateSupplier(params) {
  return request({
    url: '/wySupplier/update',
    method: 'put',
    data: params
  })
}
// 修改衬底类型
export function updateType(params) {
  return request({
    url: '/wySubstrateType/update',
    method: 'put',
    data: params
  })
}
// 修改衬底尺寸
export function updateMeasure(params) {
  return request({
    url: '/wySubstrateMeasure/update',
    method: 'put',
    data: params
  })
}
// 修改衬底尺寸
export function updateGenre(params) {
  return request({
    url: '/wySubstrateCraft/update',
    method: 'put',
    data: params
  })
}
