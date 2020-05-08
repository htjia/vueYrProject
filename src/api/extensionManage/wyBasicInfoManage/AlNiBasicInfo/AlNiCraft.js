import request from '@/utils/request'

// 工艺查询
export function findAlnMachine(params) {
  return request({
    url: '/wyAlnCraft/find',
    method: 'get',
    params
  })
}
// 工艺删除
export function remove(params) {
  return request({
    url: '/wyAlnCraft/delete',
    method: 'delete',
    params
  })
}
// 工艺添加
export function addAlnMachine(params) {
  return request({
    url: '/wyAlnCraft/save',
    method: 'post',
    data: params
  })
}
// 工艺状态修改
export function updateMachineStatus(params) {
  return request({
    url: '/wyAlnCraft/disableEnable',
    method: 'post',
    params
  })
}
