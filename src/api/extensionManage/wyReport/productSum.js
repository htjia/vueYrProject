import request from '@/utils/request'
// 查询
export function find(params) {
  return request({
    url: '/wyReportProductSum/findProductSum',
    method: 'get',
    params
  })
}
