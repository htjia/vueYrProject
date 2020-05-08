import request from '@/utils/request'

// 列表查询
export function findScan(params) {
  return request({
    url: '/xpResidualLayer/findScan',
    method: 'get',
    params
  })
}
// 新增
export function save(params) {
  return request({
    url: '/xpResidualLayer/save',
    method: 'post',
    params
  })
}
