import request from '@/utils/request'
// 列表
export function KHfindList(params) {
  return request({
    url: '/yrDdCustomerController/findPage',
    method: 'get',
    params
  })
}
// 删除
export function KHdeleteFake(params) {
  return request({
    url: '/yrDdCustomerController/deleteFake',
    method: 'delete',
    params
  })
}
// 新增
export function KHsaveObj(params) {
  return request({
    url: '/yrDdCustomerController/save',
    method: 'post',
    data: params
  })
}

// 编辑
export function KHupdateObj(params) {
  return request({
    url: '/yrDdCustomerController/update',
    method: 'post',
    data: params
  })
}
// 列表
export function BCfindList(params) {
  return request({
    url: '/yrDdPackageCatgoryController/findPage',
    method: 'get',
    params
  })
}
// 删除
export function BCdeleteFake(params) {
  return request({
    url: '/yrDdPackageCatgoryController/deleteFake',
    method: 'delete',
    params
  })
}
// 新增
export function BCsaveObj(params) {
  return request({
    url: '/yrDdPackageCatgoryController/save',
    method: 'post',
    data: params
  })
}

// 编辑
export function BCupdateObj(params) {
  return request({
    url: '/yrDdPackageCatgoryController/update',
    method: 'post',
    data: params
  })
}
