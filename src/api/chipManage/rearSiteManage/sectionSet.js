import request from '@/utils/request'

// 查询
export function sectionGet(params) {
  return request({
    url: '/xpSectionSet/sectionGet',
    method: 'get',
    params
  })
}
// 设置
export function sectionSet(params) {
  return request({
    url: '/xpSectionSet/sectionSet',
    method: 'post',
    params
  })
}
// 参数区间查询
export function getSectionStatis(params) {
  return request({
    url: '/xpSectionSet/getSectionStatis',
    method: 'get',
    params
  })
}
// 单文件Bin统计查询
export function getSingleBinStatis(params) {
  return request({
    url: '/xpSectionSet/getSingleBinStatis',
    method: 'get',
    params
  })
}
// 多文件Bin统计查询
export function getMulBinStatis(params) {
  return request({
    url: '/xpSectionSet/getMulBinStatis',
    method: 'get',
    params
  })
}

