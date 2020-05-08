import request from '@/utils/request'

// 机台查询
export function machineList(params) {
  return request({
    url: '/wyMachine/findList',
    method: 'get',
    params
  })
}

// 新增衬底信息
export function addSubstrate(params) {
  return request({
    url: '/wySubstrate/insert',
    method: 'post',
    data: params
  })
}
// 数据导入记录
export function dataOperateRecord(params) {
  return request({
    url: '/dataOperateRecord/list',
    method: 'get',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/wySubstrate/${params.id}/delete`,
    method: 'delete'
  })
}

// 修改
export function update(params) {
  return request({
    url: '/wySubstrate/update',
    method: 'put',
    data: params
  })
}
