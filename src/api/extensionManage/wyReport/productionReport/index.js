import request from '@/utils/request'

// 产品列表
export function getProductType(params) {
  return request({
    url: '/scMonthPlan/getProductType',
    method: 'get',
    params
  })
}
// 衬底工艺
export function genreFindList(params) {
  return request({
    url: '/wySubstrateCraft/findList',
    method: 'get',
    params
  })
}
// 衬底尺寸
export function findSubstrateMeasureList(params) {
  return request({
    url: '/wySubstrateMeasure/findList',
    method: 'get',
    params
  })
}
// 衬底类型
export function cdfindList(params) {
  return request({
    url: '/wySubstrateType/findList',
    method: 'get'
  })
}
// 结构类型查询
export function findStructureType(params) {
  return request({
    url: '/wyStructureType/findSelect',
    method: 'get',
    params
  })
}
// 生产类型查询
export function findProduceType(params) {
  return request({
    url: '/wyProduceType/findAll',
    method: 'get',
    params
  })
}
// 外延机台
export function machineList(params) {
  return request({
    url: '/wyMachine/findList',
    method: 'get',
    params
  })
}
// 目检等级
export function levelQuery(params) {
  return request({
    url: '/wy-visual-level/query',
    method: 'get',
    params
  })
}
// 光色系列
export function yrWyStructureSeries(params) {
  return request({
    url: '/yrWyStructureSeriesController/findSelect',
    method: 'get',
    params
  })
}

// 本月产量统计
export function currentMonthYield(params) {
  return request({
    url: '/wyReportController/currentMonthYield',
    method: 'get',
    params
  })
}

// 按综合判定统计图表
export function comprehensiveChart(params) {
  return request({
    url: '/wyReportController/comprehensiveChart',
    method: 'get',
    params
  })
}
// 按综合判定统计表格
export function comprehensiveTable(params) {
  return request({
    url: '/wyReportController/comprehensiveTable',
    method: 'get',
    params
  })
}

// 按产品类型统计各机台图表
export function productTypeStatisticsChart(params) {
  return request({
    url: '/wyReportController/productTypeStatisticsChart',
    method: 'get',
    params
  })
}

// 按产品类型统计各机台表格
export function productTypeStatisticsTable(params) {
  return request({
    url: '/wyReportController/productTypeStatisticsTable',
    method: 'get',
    params
  })
}

// S品/R品各机台周对比图表
export function sAndRCompared(params) {
  return request({
    url: '/wyReportController/sAndRCompared',
    method: 'get',
    params
  })
}

// 根据光色、尺寸统计合格片量
export function colorSizeQualified(params) {
  return request({
    url: '/wyReportController/colorSizeQualified',
    method: 'get',
    params
  })
}

// 根据光色、尺寸统计合格片量表格
export function colorSizeQualifiedTable(params) {
  return request({
    url: '/wyReportController/colorSizeQualifiedTable',
    method: 'get',
    params
  })
}

// 按目检结果统计产量图表
export function visualInspectionResultChart(params) {
  return request({
    url: '/wyReportController/visualInspectionResultChart',
    method: 'get',
    params
  })
}

// 按目检结果统计产量表格
export function visualInspectionResultTable(params) {
  return request({
    url: '/wyReportController/visualInspectionResultTable',
    method: 'get',
    params
  })
}
// 获取动态表头
export function getMjHead(params) {
  return request({
    url: '/wyReportController/getMjHead',
    method: 'get',
    params
  })
}

// 外延参数统计入库量图表
export function wyParamStatisticalChart(params) {
  return request({
    url: '/wyReportController/wyParamStatisticalChart',
    method: 'get',
    params
  })
}

// 良率周
export function yieldWeek(params) {
  return request({
    url: '/wyReportController/yieldWeek',
    method: 'get',
    params
  })
}

// 按日期查看光强
export function lightIntensityDate(params) {
  return request({
    url: '/wyReportController/lightIntensityDate',
    method: 'get',
    params
  })
}

// 按机台查看光强
export function lightIntensityMachine(params) {
  return request({
    url: '/wyReportController/lightIntensityMachine',
    method: 'get',
    params
  })
}

// 按run查看光强
export function lightIntensityRun(params) {
  return request({
    url: '/wyReportController/lightIntensityRun',
    method: 'get',
    params
  })
}

// 按日期、机台、Run次查看光强表格
export function lightIntensityTable(params) {
  return request({
    url: '/wyReportController/lightIntensityTable',
    method: 'get',
    params
  })
}
