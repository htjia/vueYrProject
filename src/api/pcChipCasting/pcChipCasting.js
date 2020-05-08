import request from '@/utils/request'

// 厂区列表
export function scFactoryList() {
  return request({
    url: '/scFactory/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 投片类别列表
export function scCategoryList(params) {
  return request({
    url: '/scCategory/find',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
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
      type: 0,
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 产品代码
export function scProductModel(params) {
  return request({
    url: '/scProductModel/find',
    method: 'get',
    params
  })
}
// 投片记录
export function scProduceTaskFind(params) {
  return request({
    url: '/scProduceTask/find',
    method: 'get',
    params
  })
}
// 投片记录
export function checkPattern(params) {
  return request({
    url: '/scProduceTask/checkPattern',
    method: 'post',
    params
  })
}
// 入库标签列表
export function xpWarehousLabel(params) {
  return request({
    url: '/xpWarehousLabel/find',
    method: 'get',
    params
  })
}
// 获取批号和单号
export function findBatchAndBillNo(params) {
  return request({
    url: '/scProduceTask/findBatchAndBillNo',
    method: 'get',
    params
  })
}
// 获取单据
export function findWaitBill(params) {
  return request({
    url: '/scProduceTask/findWaitBill',
    method: 'get',
    params
  })
}
// 获取wafer
export function findWaitWafer(params) {
  return request({
    url: '/scProduceTask/findWaitWafer',
    method: 'get',
    params
  })
}
// 保存投片
export function save(params) {
  return request({
    url: '/scProduceTask/save',
    method: 'post',
    data: params
  })
}
// 批号管理
export function updateBatchNo(params) {
  return request({
    url: '/scProduceTask/updateBatchNo',
    method: 'post',
    params
  })
}
// 批号获取
export function findBatchManager() {
  return request({
    url: '/scProduceTask/findBatchManager',
    method: 'get'
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
// 查询单条流程卡信息
export function fetchCardInfo(params) {
  return request({
    url: '/gyFlowCard/findProcessAndModel',
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
// 打印
export function printLabel(params) {
  return request({
    url: '/print/printLabel',
    method: 'post',
    data: params
  })
}
// wafer详情
export function findWafer(params) {
  return request({
    url: '/scProduceTask/findWafer',
    method: 'get',
    params
  })
}
// wafer详情
export function findBackWafer(params) {
  return request({
    url: '/scProduceTask/findBackWafer',
    method: 'get',
    params
  })
}
