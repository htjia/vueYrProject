import request from '@/utils/request'

// 查询
export function findMachineList(params) {
  return request({
    url: '/print/findList',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/print/insertTemp',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/print/updateTemp',
    method: 'put',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/print/${params.id}/deleteTemp`,
    method: 'get'
  })
}
// 查询
export function findTempList(params) {
  return request({
    url: '/print/findTempList',
    method: 'get',
    params
  })
}
