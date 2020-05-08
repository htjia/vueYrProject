import request from '@/utils/request'

// 查询
export function siteSelect(params) {
  return request({
    url: '/xp-beforeProcessManage/siteSelect',
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
// 接片扫描
export function acceptSliceScan(params) {
  return request({
    url: '/xp-beforeProcessManage/acceptSliceScan',
    method: 'get',
    params
  })
}
// 接片
export function acceptSlice(params) {
  return request({
    url: '/xp-beforeProcessManage/acceptSlice',
    method: 'get',
    params
  })
}
// 上片
export function upSlice(params) {
  return request({
    url: '/xp-beforeProcessManage/upSlice',
    method: 'get',
    params
  })
}
// 传片
export function sendSlice(params) {
  return request({
    url: '/xp-beforeProcessManage/sendSlice',
    method: 'get',
    params
  })
}
// 查询拆批数据
export function cutSlice(params) {
  return request({
    url: '/xp-beforeProcessManage/cutSlice',
    method: 'get',
    params
  })
}
// 查询对应的备注
export function getRemark(params) {
  return request({
    url: '/xp-beforeProcessManage/getRemark',
    method: 'get',
    params
  })
}
// 查询对应的程序
export function getProgram(params) {
  return request({
    url: '/xp-beforeProcessManage/getProgram',
    method: 'get',
    params
  })
}
// 查询机台
export function findMachinList(params) {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params
  })
}
// 查询Run编号List
export function getRunCodeList(params) {
  return request({
    url: '/xp-beforeProcessManage/getRunCodeList',
    method: 'get',
    params
  })
}
// 查询蚀刻 Run编号List
export function getEtchRunCodeList(params) {
  return request({
    url: '/xp-beforeProcessManage/findRunNo',
    method: 'get',
    params
  })
}
// 查询getWeight
export function getWeight(params) {
  return request({
    url: '/xp-beforeProcessManage/getWeight',
    method: 'get',
    params
  })
}
// 下载
export function downLoadFile(params) {
  return request({
    url: '/xp-produceTrack/down',
    method: 'get',
    params
  })
}
// 后段接片扫描
export function afterReceiveScanning(params) {
  return request({
    url: '/xp-scanning/after-sorting-scanning',
    method: 'get',
    params
  })
}
// 获取异常配置参数范围
export function findSiteException(params) {
  return request({
    url: '/xp-beforeProcessManage/findSiteException',
    method: 'get',
    params
  })
}
// 获取对应角色人员
export function findUserByRoleName(params) {
  return request({
    url: '/user/findUserByRoleName',
    method: 'get',
    params
  })
}
// 获取机台对应的阈值
export function findGrandTotal(params) {
  return request({
    url: '/yrXpRawMaterialController/findGrandTotal',
    method: 'get',
    params
  })
}
// 根据批号后三位获取电极材料
export function findMateListByElec(params) {
  return request({
    url: '/scElectrode/findMateListByElec',
    method: 'get',
    params
  })
}
// 根据机台获取材料
export function rawMaterial(params) {
  return request({
    url: '/yrXpRawMaterialController/find',
    method: 'get',
    params
  })
}
// 根据Run编号获取材料
export function findZdMaterialList(params) {
  return request({
    url: '/yrXpRawMaterialController/findZdMaterialList',
    method: 'get',
    params
  })
}
// 蒸镀上片保存table参数
export function saveZdMaterial(params) {
  return request({
    url: '/yrXpRawMaterialController/saveZdMaterial',
    method: 'post',
    data: params
  })
}
// 蒸镀传片保存table参数
export function updateZdMaterial(params) {
  return request({
    url: '/yrXpRawMaterialController/updateZdMaterial',
    method: 'post',
    data: params
  })
}
