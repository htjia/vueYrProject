import request from '@/utils/request'

// 列表
export function findElecMateList() {
  return request({
    url: '/scElectrode/findElecMateList',
    method: 'get'
  })
}
// 列表
export function saveElecMate(params) {
  return request({
    url: '/scElectrode/saveElecMate',
    method: 'post',
    data: params
  })
}
export function findMaterialSelect(params) {
  return request({
    url: '/scElectrode/findMaterialSelect',
    method: 'get',
    params
  })
}
