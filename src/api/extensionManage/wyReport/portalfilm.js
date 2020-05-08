import request from '@/utils/request'

// 入库图表
export function queryChartData(params) {
  return request({
    url: '/WyReportProductManagement/validationFilmMonitorRkChart',
    method: 'get',
    params
  })
}
// 入库表格
export function queryTableData(params) {
  return request({
    url: '/WyReportProductManagement/validationFilmMonitorRkTable',
    method: 'get',
    params
  })
}
// 在制图表
export function queryZzChartData(params) {
  return request({
    url: '/WyReportProductManagement/validationFilmMonitorZzChart',
    method: 'get',
    params
  })
}
