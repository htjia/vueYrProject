import request from '@/utils/request'

// 计算判定
export function calculate(params) {
  return request({
    url: '/wyComprehensive/calculate',
    method: 'post',
    params
  })
}
// 入库 待定 控制篇操作
export function decide(params) {
  return request({
    url: '/wyComprehensive/decide',
    method: 'post',
    params
  })
}
// wafer位置列表
export function findField(params) {
  return request({
    url: '/wyComprehensive/findField',
    method: 'get',
    params
  })
}
// 列表
export function findRunInfo(params) {
  return request({
    url: '/wyComprehensive/findRunInfo',
    method: 'get',
    params
  })
}
// wafer列表
export function findWafer(params) {
  return request({
    url: '/wyComprehensive/findWafer',
    method: 'get',
    params
  })
}
// 强制计算
export function mandatory(params) {
  return request({
    url: '/wyComprehensive/mandatory',
    method: 'post',
    params
  })
}
// 撤销计算
export function undoCalculate(params) {
  return request({
    url: '/wyComprehensive/undoCalculate',
    method: 'post',
    params
  })
}
// 撤销判定
export function undoDecide(params) {
  return request({
    url: '/wyComprehensive/undoDecide',
    method: 'post',
    params
  })
}
// 判定下拉
export function query(params) {
  return request({
    url: '/wy-accept-norm/query',
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
// 衬底类型管理
export function substrateFindList() {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get'
  })
}
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

// 强制判定弹窗
export function findCowTable(params) {
  return request({
    url: '/wyComprehensive/findCowTable',
    method: 'get',
    params
  })
}

