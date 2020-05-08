import request from '@/utils/request'

// 列表查询
export function findWarehous(params) {
  return request({
    url: '/wyWarehous/findWarehous',
    method: 'get',
    params
  })
}

// 详情查询
export function findWaferInfo(params) {
  return request({
    url: '/wyWarehous/findWaferInfo',
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

// wafer列表
export function findWaferInfoForStorage(params) {
  return request({
    url: '/wyWarehous/findWaferInfoForStorage',
    method: 'get',
    params
  })
}

// 树
export function findWaferRunGroup(params) {
  return request({
    url: '/wyWarehous/findWaferRunGroup',
    method: 'get',
    params
  })
}

// 机台管理
export function matfindList() {
  return request({
    url: '/wyMachine/findList',
    method: 'get'
  })
}

// 检查结果
export function autoCheck(params) {
  return request({
    url: '/wyWarehous/autoCheck',
    method: 'post',
    data: params
  })
}

// 新建入库单
export function insertNew(params) {
  return request({
    url: '/wyWarehous/insert',
    method: 'post',
    data: params
  })
}

// 验证片版型设置
export function settingQuery(params) {
  return request({
    url: '/wy-verify-layout-setting/query',
    method: 'get',
    params
  })
}

// 修改待审核
export function updateWaferNoraml(params) {
  return request({
    url: '/wyWarehous/updateWafer',
    method: 'get',
    params
  })
}

// 修改待审核
export function updateBaofei(params) {
  return request({
    url: '/wyWarehous/update',
    method: 'post',
    data: params
  })
}

export function audit(params) {
  return request({
    url: '/wyWarehous/audit',
    method: 'post',
    data: params
  })
}

// 删除入库信息
export function removeWafer(code) {
  return request({
    url: `/wyWarehous/${code}/delete`,
    method: 'delete',
    params: {
      code
    }
  })
}

// 提交报废单信息
export function submitBaofei(params) {
  return request({
    url: '/wyWarehous/submit',
    method: 'post',
    params
  })
}

// 打印
export function findPrintList(params) {
  return request({
    url: '/wyWarehous/findPrintList',
    method: 'get',
    params
  })
}

// 获取单号
export function findWarehousCode() {
  return request({
    url: '/wyWarehous/findCode',
    method: 'get'
  })
}

// 反审
export function reverseAduit(params) {
  return request({
    url: '/wyWarehous/reverseAduit',
    method: 'post',
    params
  })
}
export function queryAcceptRuleList(params) {
  return request({
    url: '/wy-accept-norm/queryAcceptRuleList',
    method: 'get',
    params
  })
}
