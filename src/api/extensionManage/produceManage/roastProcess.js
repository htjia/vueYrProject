import request from '@/utils/request'

// 查询
export function findBake(params) {
  return request({
    url: '/wyBake/find',
    method: 'get',
    params
  })
}

// 查询 操作人
export function findUser(params) {
  return request({
    url: '/wyBake/findUser',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/wyBake/save',
    method: 'post',
    data: params
  })
}
// 导出
export function exportFind(params) {
  return request({
    url: '/wyBake/export',
    method: 'get',
    params
  })
}
// 验证大盘号是否非法
export function findPlatter(params) {
  return request({
    url: '/wyBake/findPlatter',
    method: 'get',
    params
  })
}
