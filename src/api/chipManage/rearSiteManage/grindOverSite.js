import request from '@/utils/request'

// 清洗传片
export function addCleaning(params) {
  return request({
    url: '/xp-grind/add-cleaning',
    method: 'post',
    data: params
  })
}
// 传片
export function addDeliver(params) {
  return request({
    url: '/xp-grind/add-deliver',
    method: 'post',
    data: params
  })
}
// 接片
export function addReceive(params) {
  return request({
    url: '/xp-grind/add-receive',
    method: 'post',
    data: params
  })
}
// 粘片、研磨、抛光传片
export function addStick(params) {
  return request({
    url: '/xp-grind/add-stick',
    method: 'post',
    data: params
  })
}
// 结果判定
export function determine(params) {
  return request({
    url: '/xp-grind/determine',
    method: 'post',
    data: params
  })
}
// 上片
export function addUpSlice(params) {
  return request({
    url: '/xp-grind/add-upSlice',
    method: 'post',
    data: params
  })
}
// 清洗扫描
export function cleanScanning(params) {
  return request({
    url: '/xp-grind/cleaning-scanning',
    method: 'get',
    params
  })
}
// 传片扫描
export function deliverScanning(params) {
  return request({
    url: '/xp-grind/deliver-scanning',
    method: 'get',
    params
  })
}
// 数据列表查询
export function queryList(params) {
  return request({
    url: '/xp-grind/query-list',
    method: 'get',
    params
  })
}
// 查询进度
export function querySchedule(params) {
  return request({
    url: '/xp-grind/query-schedule',
    method: 'get',
    params
  })
}
// 粘片、研磨、抛光扫描
export function stickScanning(params) {
  return request({
    url: '/xp-grind/stick-scanning',
    method: 'get',
    params
  })
}
// 上片扫描
export function upSliceScanning(params) {
  return request({
    url: '/xp-grind/upSlice-scanning',
    method: 'get',
    params
  })
}
// 研磨盘校验
export function checkPlate(params) {
  return request({
    url: '/xp-grind/check-plate',
    method: 'get',
    params
  })
}
// 获取异常数据
export function findAbnormalList(params) {
  return request({
    url: '/xp-product-exception/feed-back',
    method: 'post',
    data: params
  })
}
// 查询机台
export function findMachinList(params) {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params
  })
}
// 盘类型
export function plateList(params) {
  return request({
    url: '/XpGrindingPlatterTypeController/getGrindingPlatterTypeList',
    method: 'get',
    params
  })
}
// 流水号
export function obtainSerialNum(params) {
  return request({
    url: '/xp-grind/obtainSerialNum',
    method: 'get',
    params
  })
}
// 获取没有盘号的上片数据
export function getHasUpNoPlatter(params) {
  return request({
    url: '/xp-grind/getHasUpNoPlatter',
    method: 'get',
    params
  })
}
// 带流水号异常上报基础数据
export function abnormalGrindingReport(params) {
  return request({
    url: '/xp-grind/abnormalGrindingReport',
    method: 'post',
    data: params
  })
}
// 清空类表（及流水号绑定关系）
export function clearListUpSlice(params) {
  return request({
    url: '/xp-grind/clearListUpSlice',
    method: 'post',
    data: params
  })
}
// 碎片上报
export function fragmentReport(params) {
  return request({
    url: '/xp-grind/fragmentReport',
    method: 'post',
    data: params
  })
}
// 将要碎片上报的列表
export function willFragmentReportList(params) {
  return request({
    url: '/xp-grind/willFragmentReportList',
    method: 'post',
    params
  })
}
// 碎片记录
export function fragmentRecord(params) {
  return request({
    url: '/xp-grind/fragmentRecord',
    method: 'get',
    params
  })
}
// 删除碎片记录
export function deleteFragment(params) {
  return request({
    url: `xp-grind/${params.id}/deleteFragment`,
    method: 'delete',
    params
  })
}

