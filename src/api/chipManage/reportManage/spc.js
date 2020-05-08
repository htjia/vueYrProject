import request from '@/utils/request'
// 型号管理
export function findModelList() {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      status: 0
    }
  })
}
// 机台信息
export function findMachineList(params) {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params: params
  })
}
// 根据程序查询机台信息
export function findMachineByProcess(params) {
  return request({
    url: '/xpSpcConfig/findMachineByProcessId',
    method: 'get',
    params: params
  })
}
// 查询程序
export function findProgram(params) {
  return request({
    url: '/gyProgram/query',
    method: 'get',
    params
  })
}
// 查询程序
export function xpSpcConfigFind(params) {
  return request({
    url: '/xpSpcConfig/find',
    method: 'get',
    params
  })
}
// 根据ID查询程序
export function findProgramByProcessId(params) {
  return request({
    url: '/xpSpcConfig/findProgramByProcessId',
    method: 'get',
    params
  })
}
// ito
export function xpSpcConfigITO(params) {
  return request({
    url: '/xpSpc/findSpcITO',
    method: 'get',
    params
  })
}
// 电极
export function xpSpcConfigDJ(params) {
  return request({
    url: '/xpSpc/findSpcDJ',
    method: 'get',
    params
  })
}
// 蚀刻
export function xpSpcConfigSK(params) {
  return request({
    url: '/xpSpc/findSpcSK',
    method: 'get',
    params
  })
}
// 沉积
export function xpSpcConfigCJ(params) {
  return request({
    url: '/xpSpc/findSpcCJ',
    method: 'get',
    params
  })
}
export function getProgram(params) {
  return request({
    url: '/gy-process/get-program',
    method: 'get',
    params
  })
}
export function save(params) {
  return request({
    url: '/xpSpcConfig/save',
    method: 'post',
    data: params
  })
}
