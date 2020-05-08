import request from '@/utils/request'

// 列表
export function selectAll(params) {
  return request({
    url: '/xpFQCDataMonitoring/select',
    method: 'get',
    params
  })
}
