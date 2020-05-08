import request from '@/utils/request'

// 列表
export function loadFacade(params) {
  return request({
    url: '/zlVisualAnalyzeController/loadFacade',
    method: 'get',
    params
  })
}
// 列表
export function loadInStorage(params) {
  return request({
    url: '/zlVisualAnalyzeController/loadInStorage',
    method: 'get',
    params
  })
}
// 列表
export function loadOutStorage(params) {
  return request({
    url: '/zlVisualAnalyzeController/loadOutStorage',
    method: 'get',
    params
  })
}
