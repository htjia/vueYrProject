import request from '@/utils/request'

// 查询
export function queryAll(params) {
  return request({
    url: '/wy-give-slice/query-all',
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

// 控制片
export function pendingControlslice(params) {
  return request({
    url: '/wy-control-slice/pending-control-slice',
    method: 'get',
    params
  })
}

// 待选验证片
export function pendingSlice(params) {
  return request({
    url: '/wy-choose-slice/pending-slice',
    method: 'get',
    params
  })
}
// 待选验证片
export function alternativeSliceWafers(params) {
  return request({
    url: '/wy-choose-slice/alternative-slice-wafers',
    method: 'get',
    params
  })
}
// 删除验证片
export function deleteBill(params) {
  return request({
    url: '/wy-give-slice/delete-bill',
    method: 'delete',
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

// 炉次管理
export function furnacefindAll(params) {
  return request({
    url: '/wyStove/findAll',
    method: 'get',
    params
  })
}

// 验证片版型管理
export function substrateFindList() {
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

// 结构类型管理
export function structurefindAll() {
  return request({
    url: '/wyStructureType/findAll',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
// 结构类型管理
export function wySubstrateCraftList() {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get'
  })
}

// 判定指向管理
export function decideFind(params) {
  return request({
    url: '/wyDecide/find',
    method: 'get',
    params
  })
}

// 待选验证片
export function chooseAdd(params) {
  return request({
    url: '/wy-choose-slice/add',
    method: 'post',
    data: params
  })
}

// 送片添加与修改
export function addAndUpdate(params) {
  return request({
    url: '/wy-give-slice/add-and-update',
    method: 'post',
    data: params
  })
}

export function billNo(params) {
  return request({
    url: '/wy-give-slice/generate-bill-no',
    method: 'get',
    params
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
// 用户列表
export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 选片列表
export function alternativeSlice(params) {
  return request({
    url: '/wy-choose-slice/alternative-slice',
    method: 'get',
    params
  })
}
