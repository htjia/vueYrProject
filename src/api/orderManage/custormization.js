import request from '@/utils/request'

// 删除
export function deleteFake(params) {
  return request({
    url: '/yrDdCustomizationRuleController/deleteFake',
    method: 'delete',
    params
  })
}

// 启用
export function disableEnable(params) {
  return request({
    url: '/yrDdCustomizationRuleController/disableEnable',
    method: 'post',
    params
  })
}

// 列表
export function findOptions(params) {
  return request({
    url: '/yrDdCustomizationRuleController/findPage',
    method: 'get',
    params
  })
}

// 列表
export function findById(params) {
  return request({
    url: '/yrDdCustomizationRuleController/findById',
    method: 'get',
    params
  })
}
// 下拉框列表
export function findSelect(params) {
  return request({
    url: '/yrDdCustomizationRuleController/findSelect',
    method: 'get',
    params
  })
}

// 新增
export function saveObj(params) {
  return request({
    url: '/yrDdCustomizationRuleController/save',
    method: 'post',
    data: params
  })
}

// 编辑
export function updateObj(params) {
  return request({
    url: '/yrDdCustomizationRuleController/update',
    method: 'post',
    data: params
  })
}

// 客户名称
export function findCustomer(params) {
  return request({
    url: '/yrDdCustomerController/findSelect',
    method: 'get',
    params
  })
}
// 客户名称
export function findController(params) {
  return request({
    url: '/yrDdPackageCatgoryController/findSelect',
    method: 'get',
    params
  })
}
