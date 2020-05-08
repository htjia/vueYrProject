import request from '@/utils/request'

// 新增查询
export function templateList(params) {
  return request({
    url: '/wyReportTemplateLibraryController/selectList',
    method: 'get',
    params
  })
}

// 删除模板
export function deleteById(params) {
  return request({
    url: `/wyReportTemplateLibraryController/${params.id}/deleteById`,
    method: 'delete',
    params
  })
}
// 创建图表
export function processReportDisplay(params) {
  return request({
    url: '/wyReportTemplateLibraryController/processReportDisplay',
    method: 'get',
    params
  })
}
// 新增模板
export function insert(params) {
  return request({
    url: '/wyReportTemplateLibraryController/insert',
    method: 'post',
    data: params
  })
}

// 新增视图
export function updateDetail(params) {
  return request({
    url: '/wyReportTemplateLibraryController/updateDetail',
    method: 'post',
    data: params
  })
}
// 调整视图顺序、删除
export function updateSequence(params) {
  return request({
    url: '/wyReportTemplateLibraryController/deleteAndSort',
    method: 'post',
    data: params
  })
}
