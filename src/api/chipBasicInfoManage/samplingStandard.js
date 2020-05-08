import request from '@/utils/request'

// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
// 型号管理
export function findModelList() {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 列表
export function findList(params) {
  return request({
    url: '/xpCotSamplingNorm/find',
    method: 'get',
    params
  })
}
// 启用
export function disableEnable(params) {
  return request({
    url: '/xpCotSamplingNorm/disableEnable',
    method: 'post',
    params
  })
}
// 新增
export function save(params) {
  return request({
    url: '/xpCotSamplingNorm/save',
    method: 'post',
    data: params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: '/xpCotSamplingNorm/delete',
    method: 'delete',
    params
  })
}
// 详情
export function findDetail(params) {
  return request({
    url: '/xpCotSamplingNorm/findDetail',
    method: 'get',
    params
  })
}
// 列表
export function findCOWList(params) {
  return request({
    url: '/xp-cow-sampling-standard/query-list',
    method: 'get',
    params
  })
}
// 启用
export function disableCowEnable(params) {
  return request({
    url: '/xp-cow-sampling-standard/enable-disabling',
    method: 'get',
    params
  })
}
// 删除
export function deletesCow(params) {
  return request({
    url: `/xp-cow-sampling-standard/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 新增
export function saveCOW(params) {
  return request({
    url: '/xp-cow-sampling-standard/add',
    method: 'post',
    data: params
  })
}
// 修改
export function updateCOW(params) {
  return request({
    url: '/xp-cow-sampling-standard/update',
    method: 'post',
    data: params
  })
}
// 列表
export function findAOIList(params) {
  return request({
    url: '/xp-aoi-sampling-standard/query-list',
    method: 'get',
    params
  })
}
// 启用
export function disableAOIEnable(params) {
  return request({
    url: '/xp-aoi-sampling-standard/enable-disabling',
    method: 'get',
    params
  })
}
// 删除
export function deletesAOI(params) {
  return request({
    url: `/xp-aoi-sampling-standard/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 新增
export function saveAOI(params) {
  return request({
    url: '/xp-aoi-sampling-standard/add',
    method: 'post',
    data: params
  })
}
// 修改
export function updateAOI(params) {
  return request({
    url: '/xp-aoi-sampling-standard/update',
    method: 'post',
    data: params
  })
}
