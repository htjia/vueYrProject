import request from '@/utils/request'

// 机台管理
export function matfindList() {
  return request({
    url: '/wyMachine/findList',
    method: 'get'
  })
}
// 炉号管理
export function furnacefindAll(params) {
  return request({
    url: '/wyStove/findAll',
    method: 'get',
    params
  })
}
// 获取run信息
export function getRunMsg(params) {
  return request({
    url: '/zl-visual-amend/get-run-msg',
    method: 'get',
    params
  })
}
// 目检等级
export function levelQuery(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 目检原因
export function reasonQuery(params) {
  return request({
    url: '/wy-visual-reason/queryList',
    method: 'get',
    params
  })
}
// 目检完成
export function completeCheck(params) {
  return request({
    url: '/zl-visual-amend/complete-check',
    method: 'post',
    data: params
  })
}
// 生成异常单列表
export function getAbnormalList(params) {
  return request({
    url: '/zl-visual-amend/get-abnormal-list',
    method: 'post'
  })
}
// 生成异常单号
export function getBillNo(params) {
  return request({
    url: '/zl-visual-amend/generate-bill-no',
    method: 'get',
    params
  })
}
// 异常单确认
export function confirmException(params) {
  return request({
    url: '/zl-visual-amend/confirm-exception',
    method: 'post',
    data: params
  })
}
// 生成异常单
export function addAbnormalList(params) {
  return request({
    url: '/zl-visual-amend/add-abnormal-list',
    method: 'post',
    data: params
  })
}
// 异常单查询
export function exceptionList(params) {
  return request({
    url: '/zl-visual-amend/exception-list',
    method: 'get',
    params
  })
}
// 目检明细
export function queryVisualDetail(params) {
  return request({
    url: '/zl-visual-amend/query-visual-detail',
    method: 'get',
    params
  })
}
// 查询送片
export function queryList(params) {
  return request({
    url: '/wy-give-slice/queryList',
    method: 'get',
    params
  })
}
// 查询单个信息
export function queryOneDetail(params) {
  return request({
    url: '/wy-give-slice/query-one-detail',
    method: 'get',
    params
  })
}
// 用户列表
export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
// 品保审核
export function qualityAssuranceAudit(params) {
  return request({
    url: '/wy-give-slice/quality-assurance-audit',
    method: 'get',
    params
  })
}
// 反审
export function counterTrial(params) {
  return request({
    url: '/wy-give-slice/counter-trial',
    method: 'get',
    params
  })
}
// 外观抽检
export function zlqueryList(params) {
  return request({
    url: '/ZlSpotCheck/query-list',
    method: 'get',
    params
  })
}
// 外观增加
export function zlAdd(params) {
  return request({
    url: '/ZlSpotCheck/add',
    method: 'post',
    data: params
  })
}
// 外观启用禁用
export function enableDisabling(params) {
  return request({
    url: '/ZlSpotCheck/enable-disabling',
    method: 'get',
    params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/ZlSpotCheck/${params.id}/delete`,
    method: 'get'
  })
}
// 获取wafer
export function findWafer(params) {
  return request({
    url: '/zl-visual-amend/testing-wafer',
    method: 'get',
    params
  })
}
// 退回产线
export function insertPLine(params) {
  return request({
    url: '/zl-visual-amend/insert-PLine',
    method: 'get',
    params
  })
}
