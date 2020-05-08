import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/scProduceTask/find',
    method: 'get',
    params
  })
}
// 切割传片
export function addDeliver(params) {
  return request({
    url: '/xp-cut-manage/add-deliver',
    method: 'post',
    data: params
  })
}
// 切割接片
export function addReceive(params) {
  return request({
    url: '/xp-cut-manage/add-receive',
    method: 'post',
    data: params
  })
}
// 传片扫码
export function deliverScanning(params) {
  return request({
    url: '/xp-cut-manage/deliver-scanning',
    method: 'get',
    params
  })
}
// 生成标签
export function generateTags(params) {
  return request({
    url: '/xp-cut-manage/generate-tags',
    method: 'post',
    data: params
  })
}
// 查询切割过站数据列表
export function queryDeliverList(params) {
  return request({
    url: '/xp-cut-manage/query-deliver-list',
    method: 'get',
    params
  })
}
// 查询点检数据列表
export function querySpotCheckList(params) {
  return request({
    url: '/xp-cut-manage/query-spot-check-list',
    method: 'get',
    params
  })
}
// 切割点检(补打标签)
export function replaceLabels(params) {
  return request({
    url: '/xp-cut-manage/replace-labels',
    method: 'post',
    data: params
  })
}
// 保存生成的标签
export function saveNewLabel(params) {
  return request({
    url: '/xp-cut-manage/save-new-label',
    method: 'post',
    data: params
  })
}
// 校验
export function spotCheck(params) {
  return request({
    url: '/xp-cut-manage/spot-check-scanning',
    method: 'get',
    params
  })
}
// 切割点检（新增标签）
export function testConfig(params) {
  return request({
    url: '/xp-cut-manage/test-config',
    method: 'post',
    data: params
  })
}
// 查询光色对应的型号
export function findForFlowCard(params) {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params
  })
}
// 文件下载
export function downByPath(params) {
  return request({
    url: '/attachment/downByPath',
    method: 'get',
    params
  })
}
