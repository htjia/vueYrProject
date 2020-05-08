import request from '@/utils/request'

// 查询
export function tagScanning(params) {
  return request({
    url: '/xp-cut-manage/label-scanning',
    method: 'get',
    params
  })
}
// 生成标签
export function createTags(params) {
  return request({
    url: '/xp-cut-manage/generate-tags',
    method: 'post',
    data: params
  })
}
// 保存生成的标签
export function saveNewLabel(params) {
  return request({
    url: '/xp-cut-manage/save-new-label',
    method: 'post',
    data: params
  })
}
// 批次打印查询
export function fragmentPrintList(params) {
  return request({
    url: '/xp-grind/fragmentPrintList',
    method: 'get',
    params
  })
}
