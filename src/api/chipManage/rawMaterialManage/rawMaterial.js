import request from '@/utils/request'
// 查询机台下拉框
export function findMachineSelect(params) {
  return request({
    url: '/yrXpRawMaterialController/findMachineSelect',
    method: 'get',
    params
  })
}

// 站点下拉框
export function findSiteSelect(params) {
  return request({
    url: '/yrXpRawMaterialController/findSiteSelect',
    method: 'get',
    params
  })
}

// 车间下拉框
export function findWorkshopSelect(params) {
  return request({
    url: '/yrXpRawMaterialController/findWorkshopSelect',
    method: 'get',
    params
  })
}

// 查询机台信息
export function findMachine(params) {
  return request({
    url: '/yrXpRawMaterialController/findMachine',
    method: 'get',
    params
  })
}

// 查询所有数据
export function findAllList(params) {
  return request({
    url: '/yrXpRawMaterialController/find',
    method: 'get',
    params
  })
}

// 获取材料名称
export function materialName(params) {
  return request({
    url: '/zlMaterial/query',
    method: 'get',
    params
  })
}
// 获取该材料类型对应的单位
export function findUnitByMaterialId(params) {
  return request({
    url: '/zlUnit/queryList',
    method: 'get',
    params
  })
}
// 查询更换记录
export function findChangeRecord(params) {
  return request({
    url: '/yrXpRawMaterialController/findChangeRecord',
    method: 'get',
    params
  })
}

// 根据批号查询数据
export function findByBatchNo(params) {
  return request({
    url: '/yrXpRawMaterialController/findByBatchNo',
    method: 'get',
    params
  })
}
// 配置材料
export function saveMaterial(params) {
  return request({
    url: '/yrXpRawMaterialController/saveMaterial',
    method: 'post',
    data: params
  })
}

// 配置管理点
export function saveMachine(params) {
  return request({
    url: '/yrXpRawMaterialController/saveMachine',
    method: 'post',
    params
  })
}

// 添加批号
export function saveBatchNo(params) {
  return request({
    url: '/yrXpRawMaterialController/saveBatchNo',
    method: 'post',
    params
  })
}

// 更换批号
export function changeBatchNo(params) {
  return request({
    url: '/yrXpRawMaterialController/changeBatchNo',
    method: 'post',
    params
  })
}

// 删除批号
export function changeBdeleteBatchNoatchNo(params) {
  return request({
    url: '/yrXpRawMaterialController/deleteBatchNo',
    method: 'delete',
    params
  })
}
