import request from '@/utils/request'

// 气体查询
export function findGasList(params) {
  return request({
    url: '/wyGasConfig/findList',
    method: 'get',
    params
  })
}

// 气体更换记录查询
export function gasRecordList(params) {
  return request({
    url: '/wyGasConfig/gasRecordList',
    method: 'get',
    params
  })
}
// 气体切换
export function gasSwitch(params) {
  return request({
    url: '/wyGasConfig/gassWitch',
    method: 'post',
    data: params
  })
}
// 切换批次
export function updateGasSource(params) {
  return request({
    url: '/wyGasConfig/updateGasSource',
    method: 'post',
    data: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/wyGasConfig/update',
    method: 'post',
    data: params
  })
}
