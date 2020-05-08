import request from '@/utils/request'

// 新增异常单
export function determine(params) {
  return request({
    url: '/xp-product-exception/determine',
    method: 'post',
    data: params
  })
}
// 编辑异常单
export function editData(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/editData',
    method: 'post',
    data: params
  })
}
// 填写原因分析
export function fillInAnalyses(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInAnalyses',
    method: 'post',
    data: params
  })
}
// 填写结案
export function fillInExceptionFinish(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInExceptionFinish',
    method: 'post',
    data: params
  })
}
// 填写永久对策信息
export function fillInPerpetualStrategy(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInPerpetualStrategy',
    method: 'post',
    data: params
  })
}
// 填写永久对策追踪
export function fillInPerpetualTrace(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInPerpetualTrace',
    method: 'post',
    data: params
  })
}
// 填写临时对策追踪
export function fillInTemporaryTrace(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInTemporaryTrace',
    method: 'post',
    data: params
  })
}
// 填写临时对策
export function fillInTemporaryStrategy(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/fillInTemporaryStrategy',
    method: 'post',
    data: params
  })
}
// 获取异常单号
export function generateBillNo(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/generateBillNo',
    method: 'get',
    params
  })
}
// 异常单查询
export function getDataList(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/getDataList',
    method: 'get',
    params
  })
}
// 获取异常处理详情
export function getDetail(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/getDetail',
    method: 'get',
    params
  })
}
// 获取异常单日志
export function getLog(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/getLog',
    method: 'get',
    params
  })
}
// 获取异常单审核
export function review(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/review',
    method: 'get',
    params
  })
}
// 原因分析审核
export function reviewAnalyses(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewAnalyses',
    method: 'get',
    params
  })
}
// 永久对策审核
export function reviewPerpetualStrategy(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewPerpetualStrategy',
    method: 'get',
    params
  })
}
// 永久对策追踪审核
export function reviewPerpetualTrace(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewPerpetualTrace',
    method: 'get',
    params
  })
}
// 永久对策追踪审核
export function reviewExceptionFinish(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewExceptionFinish',
    method: 'get',
    params
  })
}
// 审核临时对策
export function reviewTemporaryStrategy(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewTemporaryStrategy',
    method: 'get',
    params
  })
}
// 临时对策追踪审核
export function reviewTemporaryTrace(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/reviewTemporaryTrace',
    method: 'get',
    params
  })
}
// 删除文件
export function deleteFile(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/deleteFile',
    method: 'get',
    params
  })
}
// qc选择责任部门
export function qcDistributionDep(params) {
  return request({
    url: '/xpProductExceptionAbnormalController/qcDistributionDep',
    method: 'get',
    params
  })
}
export function deletes(params) {
  return request({
    url: `/xpProductExceptionAbnormalController/${params.id}/delete`,
    method: 'delete'
  })
}
