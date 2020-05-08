import request from '@/utils/request'

// 查询
export function findFp(params) {
  return request({
    url: '/xpRkData/findFp',
    method: 'get',
    params
  })
}
// 校验是否存在
export function findFpCodeExits(params) {
  return request({
    url: '/xpRkData/findFpCodeExits',
    method: 'get',
    params
  })
}

// 查询
export function findYp(params) {
  return request({
    url: '/xpRkData/findYp',
    method: 'get',
    params
  })
}

// 校验是否存在
export function findYpCodeExits(params) {
  return request({
    url: '/xpRkData/findYpCodeExits',
    method: 'get',
    params
  })
}
// 新增
export function insertBatchFp(params) {
  return request({
    url: '/xpRkData/insertBatchFp',
    method: 'post',
    data: params
  })
}
// 新增
export function insertBatchYp(params) {
  return request({
    url: '/xpRkData/insertBatchYp',
    method: 'post',
    data: params
  })
}
// 新增
export function insertFp(params) {
  return request({
    url: '/xpRkData/insertFp',
    method: 'post',
    data: params
  })
}
// 新增
export function insertYp(params) {
  return request({
    url: '/xpRkData/insertYp',
    method: 'post',
    data: params
  })
}
// 新增
export function updateFp(params) {
  return request({
    url: '/xpRkData/updateFp',
    method: 'post',
    data: params
  })
}
// 新增
export function updateYp(params) {
  return request({
    url: '/xpRkData/updateYp',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteFp(params) {
  return request({
    url: `/xpRkData/${params.id}/deleteFp`,
    method: 'get'
  })
}
// 删除
export function deleteYp(params) {
  return request({
    url: `/xpRkData/${params.id}/deleteYp`,
    method: 'get'
  })
}
// 撤销导入
export function deleteFpRecord(params) {
  return request({
    url: `/xpRkData/${params.id}/deleteFpRecord`,
    method: 'get'
  })
}
// 撤销导入
export function deleteYpRecord(params) {
  return request({
    url: `/xpRkData/${params.id}/deleteYpRecord`,
    method: 'get'
  })
}
// 数据导入导出
// 查询
export function logList(params) {
  return request({
    url: '/dataOperateRecord/list',
    method: 'get',
    params
  })
}

