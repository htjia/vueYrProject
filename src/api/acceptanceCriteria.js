import request from '@/utils/request'

// 光色列表
export function findColorList() {
  return request({
    url: '/wyStructureType/findAll',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 型号管理
export function findModelList() {
  return request({
    url: '/wy-verify-layout-setting/query',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
export function query(params) {
  return request({
    url: '/wy-accept-norm/query',
    method: 'get',
    params
  })
}
// 历史版本
export function queryHv(params) {
  return request({
    url: '/wy-accept-norm/queryHv',
    method: 'get',
    params
  })
}

// 弃用启用
export function enableDisabled(params) {
  return request({
    url: '/wy-accept-norm/enable-disabled',
    method: 'get',
    params
  })
}

// 删除规则
export function deleteRules(params) {
  return request({
    url: '/wy-accept-norm/delete-rules',
    method: 'post',
    data: params
  })
}

// 获取标准名称
export function produceName(params) {
  return request({
    url: '/wy-accept-norm/produce-norm-name',
    method: 'get',
    params
  })
}

// 修改记录
export function normUpdate(params) {
  return request({
    url: '/wy-accept-norm/update',
    method: 'post',
    data: params
  })
}

// 添加
export function normAdd(params) {
  return request({
    url: '/wy-accept-norm/add',
    method: 'post',
    data: params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/wy-accept-norm/deleteData`,
    method: 'get',
    params
  })
}

