import request from '@/utils/request'

// 产品列表
export function scProductModel(params) {
  return request({
    url: '/scProductModel/find',
    method: 'get',
    params
  })
}
// 产品列表
export function findSelect(params) {
  return request({
    url: '/scProductModel/findSelect',
    method: 'get',
    params
  })
}
// 产品启用弃用
export function disableEnable(params) {
  return request({
    url: '/scProductModel/disableEnable',
    method: 'post',
    params
  })
}
// 产品删除
export function deleteProduct(params) {
  return request({
    url: '/scProductModel/delete',
    method: 'delete',
    params
  })
}
// 产品新增
export function save(params) {
  return request({
    url: '/scProductModel/save',
    method: 'post',
    data: params
  })
}
// 电极列表
export function scElectrodeList(params) {
  return request({
    url: '/scElectrode/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
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
// 工艺管理
export function findGYlList() {
  return request({
    url: '/gy-craft/query',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 流程卡
export function gyFlowCardFind() {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 重工流程卡
export function gyagainFlowCardFind() {
  return request({
    url: '/gyFlowCard/find',
    method: 'get',
    params: {
      type: 1,
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 外延规格
export function wygg() {
  return request({
    url: '/wySubstrateType/pageList',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 芯片工艺列表
export function scChipCraftList() {
  return request({
    url: '/scChipCraft/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 切割工艺列表
export function scCuttingCraftList() {
  return request({
    url: '/scCuttingCraft/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
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
