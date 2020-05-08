import request from '@/utils/request'

// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
// 型号列表
export function findModelList() {
  return request({
    url: '/gyModelColor/findModelList',
    method: 'get'
  })
}
// 规则所属列表
export function scRuleBelongList() {
  return request({
    url: '/scRuleBelong/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 挑片列表
export function pickRuleFind(params) {
  return request({
    url: '/scPickRule/find',
    method: 'get',
    params
  })
}
// 挑片详情
export function findDetail(params) {
  return request({
    url: '/scPickRule/findDetail',
    method: 'get',
    params
  })
}
// 启用禁用
export function disableEnable(params) {
  return request({
    url: '/scPickRule/disableEnable',
    method: 'post',
    params
  })
}
// 规则删除
export function deleteRule(params) {
  return request({
    url: '/scPickRule/delete',
    method: 'delete',
    params
  })
}
// 保存挑片
export function save(params) {
  return request({
    url: '/scPickRule/save',
    method: 'post',
    data: params
  })
}
// 查看历史
export function findHistory(params) {
  return request({
    url: '/scPickRule/findHistory',
    method: 'get',
    params
  })
}
