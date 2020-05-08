import request from '@/utils/request'

// 查询
export function fetchList(params) {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params
  })
}
// 根据工序ID查询程序
export function fetchProgram(params) {
  return request({
    url: '/gy-process/get-program',
    method: 'get',
    params
  })
}
// 查询历史版本
export function fetchHistoryList(params) {
  return request({
    url: '/gyFlowCard/findHistory',
    method: 'get',
    params
  })
}
// 查询单条流程卡信息
export function fetchCardInfo(params) {
  return request({
    url: '/gyFlowCard/findProcessAndModel',
    method: 'get',
    params
  })
}
// 新增流程卡重复字段验证
export function informationCheck(params) {
  return request({
    url: '/gyFlowCard/informationCheck',
    method: 'get',
    params
  })
}
// 查询工艺
export function craftList(params) {
  return request({
    url: '/gy-craft/query',
    method: 'get',
    params
  })
}
// 删除流程卡
export function remove(params) {
  return request({
    url: `/gyFlowCard/delete`,
    method: 'delete',
    params
  })
}
// 查询光色
export function fetchColorList(params) {
  return request({
    url: '/gyModelColor/findColorList',
    method: 'get',
    params
  })
}
// 查询光色对应的型号
export function findForFlowCard(params) {
  return request({
    url: '/scProductModel/findForFlowCard',
    method: 'get',
    params
  })
}
// 编辑时查询光色对应的型号
export function findForFlowCardEdit(params) {
  return request({
    url: '/scProductModel/findForFlowCardEdit',
    method: 'get',
    params
  })
}
// 新增流程卡
export function add(params) {
  return request({
    url: '/gyFlowCard/save',
    method: 'post',
    data: params
  })
}
// 新增后段流程卡
export function saveAfter(params) {
  return request({
    url: '/gyFlowCard/saveAfter',
    method: 'post',
    data: params
  })
}

