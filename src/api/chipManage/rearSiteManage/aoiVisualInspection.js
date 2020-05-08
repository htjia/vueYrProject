import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/xp-aoi/query-list',
    method: 'get',
    params
  })
}
// 文件下载
export function downByPath(params) {
  return request({
    url: '/attachment/downByPath',
    method: 'get',
    params
  })
}
