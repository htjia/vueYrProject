import request from '@/utils/request'

// 查询
export function proceList(params) {
  return request({
    url: '/gy-process/query',
    method: 'get',
    params
  })
}

// 查询程序
export function queryProgram(params) {
  return request({
    url: '/gyProgram/query',
    method: 'get',
    params
  })
}

// 添加工序
export function add(params) {
  return request({
    url: '/gy-process/add',
    method: 'post',
    data: params
  })
}

// 修改工序
export function update(params) {
  return request({
    url: '/gy-process/enable-disabling',
    method: 'post',
    data: params
  })
}

// 删除工序
export function remove(params) {
  return request({
    url: `/gy-process/${params.id}/delete`,
    method: 'get',
    params
  })
}

