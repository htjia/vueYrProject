import request from '@/utils/request'

// 列表
export function queryList() {
  return request({
    url: '/xp-wavelength-concentration/query-list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000
    }
  })
}
export function queryLists(params) {
  return request({
    url: '/xp-wavelength-concentration/query-list',
    method: 'get',
    params
  })
}
// 新增详细
export function addDetail(params) {
  return request({
    url: '/xp-wavelength-concentration/add',
    method: 'post',
    data: params
  })
}
// 修改详细
export function updateDetail(params) {
  return request({
    url: '/xp-wavelength-concentration/update',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteDetail(params) {
  return request({
    url: `/xp-wavelength-concentration/${params.id}/delete`,
    method: 'delete',
    params
  })
}
