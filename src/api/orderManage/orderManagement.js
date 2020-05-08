import request from '@/utils/request'
// 删除/关闭/出库
export function deleteFake(params) {
  return request({
    url: '/yrDdOrderController/changeStatus',
    method: 'post',
    params
  })
}
// 列表
export function findList(params) {
  return request({
    url: '/yrDdOrderController/findPage',
    method: 'get',
    params
  })
}

// 新增
export function saveObj(params) {
  return request({
    url: '/yrDdOrderController/save',
    method: 'post',
    data: params
  })
}

// 编辑
export function updateObj(params) {
  return request({
    url: '/yrDdOrderController/update',
    method: 'post',
    data: params
  })
}

// 查看库存
export function lookInventory(params) {
  return request({
    url: '/yrDdOrderController/lookInventory',
    method: 'post',
    data: params
  })
}

// 查询是否为紫光
export function checkSeries(params) {
  return request({
    url: 'gyColor/checkPurple',
    method: 'get',
    params
  })
}

// 查询上一次导入的
export function findLastRecord(params) {
  return request({
    url: '/yrDdOrderController/findLastRecord',
    method: 'get',
    params
  })
}

// 查询出库记录
export function findOutboundRecord(params) {
  return request({
    url: '/yrDdOrderController/findOutboundRecord',
    method: 'get',
    params
  })
}
