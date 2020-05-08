import request from '@/utils/request'
// 方片库存查询
export function findFpQuery(params) {
  return request({
    url: '/xpStorehouse/findFpQuery',
    method: 'get',
    params
  })
}
// 圆片库存查询
export function findYpQuery(params) {
  return request({
    url: '/xpStorehouse/findYpQuery',
    method: 'get',
    params
  })
}
// 波长代码
export function wavelength(params) {
  return request({
    url: '/xp-wavelength/query-list',
    method: 'get',
    params
  })
}
// 亮度代码
export function brightness(params) {
  return request({
    url: '/xp-brightness/query-list',
    method: 'get',
    params
  })
}
// 电压代码
export function voltage(params) {
  return request({
    url: '/xp-voltage/query-list',
    method: 'get',
    params
  })
}
// 集中度代码
export function concentration(params) {
  return request({
    url: '/xp-wavelength-concentration/query-list',
    method: 'get',
    params
  })
}
// 综合等级代码
export function comprehensive(params) {
  return request({
    url: '/xp-comprehensive-level/query-list',
    method: 'get',
    params
  })
}
// 圆片待查
export function updateYpCheck(params) {
  return request({
    url: '/xpStorehouse/updateYpCheck',
    method: 'post',
    params
  })
}
// 方片待查
export function updateFpCheck(params) {
  return request({
    url: '/xpStorehouse/updateFpCheck',
    method: 'post',
    params
  })
}

