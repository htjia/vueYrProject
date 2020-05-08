import request from '@/utils/request'

// 机台查询
export function findMachine(params) {
  return request({
    url: '/wyMachine/findList',
    method: 'get',
    params
  })
}
// 新增机台
export function addMachine(params) {
  return request({
    url: '/wyMachine/insert',
    method: 'post',
    data: params
  })
}
// 修改机台
export function updateMachine(params) {
  return request({
    url: '/wyMachine/update',
    method: 'put',
    data: params
  })
}
// 删除机台
export function removeMachine(params) {
  return request({
    url: `/wyMachine/${params.id}/delete`,
    method: 'delete',
    params
  })
}

// 所有人员查询
export function findUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 机台人员查询
export function findMachineUser(params) {
  return request({
    url: '/wyMachineUser/list',
    method: 'get',
    params
  })
}
// 机台人员新增
export function addMachineUser(params) {
  return request({
    url: '/wyMachineUser/insert',
    method: 'post',
    data: params
  })
}
// 机台人员状态修改
export function updateMachineUserStatus(params) {
  return request({
    url: '/wyMachineUser/update',
    method: 'put',
    data: params
  })
}

// 机台人员删除
export function deleteMachineUser(params) {
  return request({
    url: `/wyMachineUser/${params.id}/delete`,
    method: 'delete',
    params
  })
}
// 机台recipe查询
export function findRecipeMenu(params) {
  return request({
    url: '/wyRecipeMenu/find',
    method: 'get',
    params
  })
}
// 机台recipe删除
export function deleteRecipeMenu(params) {
  return request({
    url: '/wyRecipeMenu/delete',
    method: 'delete',
    params
  })
}
// 机台recipe修改状态
export function updateRecipeMenu(params) {
  return request({
    url: '/wyRecipeMenu/disableEnable',
    method: 'post',
    params
  })
}
// 机台recipe新增
export function addRecipeMenu(params) {
  return request({
    url: '/wyRecipeMenu/save',
    method: 'post',
    data: params
  })
}
// 机台大盘查询
export function findPlatter(params) {
  return request({
    url: '/wyPlatterMocvd/findListByMachineId',
    method: 'get',
    params
  })
}
