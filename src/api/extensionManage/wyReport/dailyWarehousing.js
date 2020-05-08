import request from '@/utils/request'

// 查询
export function queryParams(params) {
  return request({
    url: '/WyReportProductManagement/head',
    method: 'post',
    data: params
  })
}
