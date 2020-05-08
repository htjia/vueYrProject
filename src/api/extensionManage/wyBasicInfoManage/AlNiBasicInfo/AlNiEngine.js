import request from '@/utils/request'

// 机台查询
export function findAlnMachine(params) {
  return request({
    url: '/wyAlnMachine/find',
    method: 'get',
    params
  })
}
// 机台删除
export function remove(params) {
  return request({
    url: '/wyAlnMachine/delete',
    method: 'delete',
    params
  })
}
// 机台添加
export function addAlnMachine(params) {
  return request({
    url: '/wyAlnMachine/save',
    method: 'post',
    data: params
  })
}
// 机台状态修改
export function updateMachineStatus(params) {
  return request({
    url: '/wyAlnMachine/disableEnable',
    method: 'post',
    params
  })
}
