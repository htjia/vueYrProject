import request from '@/utils/request'

// 列表
export function queryList(params) {
  return request({
    url: '/wy-el-warning-rule/query',
    method: 'get',
    params
  })
}
export function enabledisable(params) {
  return request({
    url: '/wy-el-warning-rule/enable-disable',
    method: 'get',
    params
  })
}
export function enabledisableplatter(params) {
  return request({
    url: '/wy-el-warning-rule/enable-disable-platter',
    method: 'get',
    params
  })
}
// 等级列表
export function levelList(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 衬底类型管理
export function cdfindList(params) {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get'
  })
}
// 规则
export function addDetail(params) {
  return request({
    url: '/wy-el-warning-rule/add-detail',
    method: 'post',
    data: params
  })
}
// 树
export function departQuery() {
  return request({
    url: '/department/query',
    method: 'get'
  })
}

// 设定
export function noticeGroupSet(params) {
  return request({
    url: '/wy-el-warning-rule/notice-group-set',
    method: 'post',
    params
  })
}

// 结构类型查询
export function findStructureType(params) {
  return request({
    url: '/wyStructureType/findAll',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
