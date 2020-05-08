
import request from '@/utils/request'

// 清空有选项
export function removeSclie(params) {
  return request({
    url: '/wyAln/removeSclie',
    method: 'delete',
    params
  })
}
// 保存散片并打印
export function allotBox(params) {
  return request({
    url: '/wyAln/allotBox',
    method: 'post',
    params
  })
}
// 获取新盒号
export function findNewBoxNo(params) {
  return request({
    url: '/wyAln/findNewBoxNo',
    method: 'get',
    params
  })
}
// 保存已选项状态
export function chooseSclie(params) {
  return request({
    url: '/wyAln/chooseSclie',
    method: 'post',
    params
  })
}
// 散片查询
export function findScattered(params) {
  return request({
    url: '/wyAln/findScattered',
    method: 'get',
    params
  })
}
// 铝氮投片保存
export function add(params) {
  return request({
    url: '/wyAln/save',
    method: 'post',
    data: params
  })
}
// 铝氮投片取片
export function takeSlice(params) {
  return request({
    url: '/wyAln/takeSlice',
    method: 'post',
    params
  })
}
// 扫码导入
export function findSubstrate(params) {
  return request({
    url: '/wyAln/findSubstrate',
    method: 'get',
    params
  })
}
// run 信息查询
export function alNiList(params) {
  return request({
    url: '/wyAln/find',
    method: 'get',
    params
  })
}
// run 信息删除
export function alNiDelete(params) {
  return request({
    url: '/wyAln/delete',
    method: 'delete',
    params
  })
}
// wafer 信息查询
export function findWaferIn(params) {
  return request({
    url: '/wyAln/findSubstrateByAln',
    method: 'get',
    params
  })
}
// wafer 信息查询
export function findWafer(params) {
  return request({
    url: '/wyAln/findWafer',
    method: 'get',
    params
  })
}
// 铝氮机台查询
export function findAlnMachine(params) {
  return request({
    url: '/wyAlnMachine/findSelect',
    method: 'get',
    params
  })
}
// 铝氮工程师
export function findUser(params) {
  return request({
    url: '/wyAln/findUser',
    method: 'get',
    params
  })
}
// 铝氮工艺
export function findAlnCraft(params) {
  return request({
    url: '/wyAlnCraft/findSelect',
    method: 'get',
    params
  })
}
// 卡塞
export function findStopper(params) {
  return request({
    url: '/wyStopper/findSelect',
    method: 'get',
    params
  })
}
// pm周期
export function findCycle(params) {
  return request({
    url: '/wyAln/findCycle',
    method: 'get',
    params
  })
}
// 机台人员查询
export function findMachineUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
