import request from '@/utils/request'

// 列表
export function loadVisualError(params) {
  return request({
    url: '/zlVisualAnalyzeController/loadVisualError',
    method: 'get',
    params
  })
}

// 列表
export function loadVisualErrorDetail(params) {
  return request({
    url: '/zlVisualAnalyzeController/loadVisualErrorDetail',
    method: 'get',
    params
  })
}
