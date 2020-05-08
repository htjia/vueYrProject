import request from '@/utils/request'

// 查询
export function findList(params) {
  return request({
    url: '/zlInputNorm/find',
    method: 'get',
    params
  })
}
// 修改状态
export function update(params) {
  return request({
    url: '/zlInputNorm/disableEnable',
    method: 'post',
    params
  })
}
// 编辑
export function updateParams(params) {
  return request({
    url: '/zlInputNorm/insert',
    method: 'post',
    data: params
  })
}
// 历史版本
export function findHistory(params) {
  return request({
    url: '/zlInputNorm/findHistory',
    method: 'get',
    params
  })
}

// 选择历史版本
export function historyEnable(params) {
  return request({
    url: '/zlInputNorm/historyEnable',
    method: 'post',
    params
  })
}
