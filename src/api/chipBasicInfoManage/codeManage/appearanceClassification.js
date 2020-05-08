import request from '@/utils/request'

// 列表
export function queryList() {
  return request({
    url: '/xp-facade-classify/query-list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      isShow: 0
    }
  })
}
export function queryLists(params) {
  return request({
    url: '/xp-facade-classify/query-list',
    method: 'get',
    params
  })
}
// 新增副品
export function addFP(params) {
  return request({
    url: '/xp-facade-classify/add',
    method: 'post',
    data: params
  })
}
// 修改副品
export function updateFP(params) {
  return request({
    url: '/xp-facade-classify/update',
    method: 'post',
    data: params
  })
}
// 新增详细
export function addDetail(params) {
  return request({
    url: '/xp-facade-classify/add-detail',
    method: 'post',
    data: params
  })
}
// 修改详细
export function updateDetail(params) {
  return request({
    url: '/xp-facade-classify/update-detail',
    method: 'post',
    data: params
  })
}
// 删除
export function deleteDetail(params) {
  return request({
    url: `/xp-facade-classify/${params.id}/delete-detail`,
    method: 'delete',
    params
  })
}
