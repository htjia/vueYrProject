import request from '@/utils/request'

// 列表
export function query(params) {
  return request({
    url: '/wy-verify-layout-setting/query',
    method: 'get',
    params
  })
}
// 型号管理
export function add(params) {
  return request({
    url: '/wy-verify-layout-setting/add',
    method: 'post',
    data: params
  })
}
export function deleteSetting(params) {
  return request({
    url: `/wy-verify-layout-setting/${params}/delete`,
    method: 'get',
    params: {
      params
    }
  })
}
export function enabledisable(params) {
  return request({
    url: '/wy-verify-layout-setting/enable-disable',
    method: 'get',
    params
  })
}

