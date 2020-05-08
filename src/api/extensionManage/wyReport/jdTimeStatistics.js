import request from '@/utils/request'

// 查询
export function queryChartData(params) {
  return request({
    url: '/wyReportController/findUpTime',
    method: 'get',
    params
  })
}
