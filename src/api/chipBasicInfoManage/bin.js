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
// 工艺管理
export function findGYList() {
  return request({
    url: '/gy-craft/query',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 列表查询 0圆片1方片
export function findList(params) {
  return request({
    url: '/xpBinNorm/find',
    method: 'get',
    params
  })
}
// 删除
export function deletes(params) {
  return request({
    url: '/xpBinNorm/delete',
    method: 'delete',
    params
  })
}
// 启用
export function disableEnable(params) {
  return request({
    url: '/xpBinNorm/disableEnable',
    method: 'post',
    params
  })
}
// 新增bin
export function save(params) {
  return request({
    url: '/xpBinNorm/save',
    method: 'post',
    data: params
  })
}
// 详情
export function findDetail(params) {
  return request({
    url: '/xpBinNorm/findDetail',
    method: 'get',
    params
  })
}
// 历史
export function findHistory(params) {
  return request({
    url: '/xpBinNorm/findHistory',
    method: 'get',
    params
  })
}
// 系数校正列表
export function findCot(params) {
  return request({
    url: '/xpCotCoefficient/find',
    method: 'get',
    params
  })
}
// 启用cot
export function disableEnableCot(params) {
  return request({
    url: '/xpCotCoefficient/disableEnable',
    method: 'post',
    params
  })
}
// 删除
export function deletesCot(params) {
  return request({
    url: '/xpCotCoefficient/delete',
    method: 'delete',
    params
  })
}
// 新增bin
export function saveCot(params) {
  return request({
    url: '/xpCotCoefficient/save',
    method: 'post',
    data: params
  })
}
// 查询规则
export function findCheckNorm(params) {
  return request({
    url: '/xpCotSamplingNorm/findCheckNorm',
    method: 'get',
    params
  })
}
