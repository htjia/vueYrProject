import request from '@/utils/request'

// 厂区列表
export function scFactoryList(params) {
  return request({
    url: '/scFactory/find',
    method: 'get',
    params
  })
}
// 电极列表
export function scElectrodeList(params) {
  return request({
    url: '/scElectrode/find',
    method: 'get',
    params
  })
}
// 投片类别列表
export function scCategoryList(params) {
  return request({
    url: '/scCategory/find',
    method: 'get',
    params
  })
}
// 切割工艺列表
export function scCuttingCraftList(params) {
  return request({
    url: '/scCuttingCraft/find',
    method: 'get',
    params
  })
}
// 芯片工艺列表
export function scChipCraftList(params) {
  return request({
    url: '/scChipCraft/find',
    method: 'get',
    params
  })
}
// 目检列表
export function scVisualInspectionList(params) {
  return request({
    url: '/scVisualInspection/find',
    method: 'get',
    params
  })
}
// 规则所属列表
export function scRuleBelongList(params) {
  return request({
    url: '/scRuleBelong/find',
    method: 'get',
    params
  })
}
// 厂区添加
export function scFactoryAdd(params) {
  return request({
    url: '/scFactory/save',
    method: 'post',
    data: params
  })
}
// 电极添加
export function scElectrodeAdd(params) {
  return request({
    url: '/scElectrode/save',
    method: 'post',
    data: params
  })
}
// 投片类别添加
export function scCategoryAdd(params) {
  return request({
    url: '/scCategory/save',
    method: 'post',
    data: params
  })
}
// 切割工艺添加
export function scCuttingCraftAdd(params) {
  return request({
    url: '/scCuttingCraft/save',
    method: 'post',
    data: params
  })
}
// 芯片工艺添加
export function scChipCraftAdd(params) {
  return request({
    url: '/scChipCraft/save',
    method: 'post',
    data: params
  })
}
// 目检添加
export function scVisualInspectionAdd(params) {
  return request({
    url: '/scVisualInspection/save',
    method: 'post',
    data: params
  })
}
// 规则所属添加
export function scRuleBelongAdd(params) {
  return request({
    url: '/scRuleBelong/save',
    method: 'post',
    data: params
  })
}
// 厂区删除
export function scFactoryDelete(params) {
  return request({
    url: '/scFactory/delete',
    method: 'delete',
    params
  })
}
// 电极删除
export function scElectrodeDelete(params) {
  return request({
    url: '/scElectrode/delete',
    method: 'delete',
    params
  })
}
// 投片类别删除
export function scCategoryDelete(params) {
  return request({
    url: '/scCategory/delete',
    method: 'delete',
    params
  })
}
// 切割工艺删除
export function scCuttingCraftDelete(params) {
  return request({
    url: '/scCuttingCraft/delete',
    method: 'delete',
    params
  })
}
// 芯片工艺删除
export function scChipCraftDelete(params) {
  return request({
    url: '/scChipCraft/delete',
    method: 'delete',
    params
  })
}
// 目检删除
export function scVisualInspectionDelete(params) {
  return request({
    url: '/scVisualInspection/delete',
    method: 'delete',
    params
  })
}
// 规则所属删除
export function scRuleBelongDelete(params) {
  return request({
    url: '/scRuleBelong/delete',
    method: 'delete',
    params
  })
}
// 厂区禁启用
export function scFactoryDisableEnable(params) {
  return request({
    url: '/scFactory/disableEnable',
    method: 'post',
    params
  })
}
// 电极禁启用
export function scElectrodeDisableEnable(params) {
  return request({
    url: '/scElectrode/disableEnable',
    method: 'post',
    params
  })
}
// 投片类别禁启用
export function scCategoryDisableEnable(params) {
  return request({
    url: '/scCategory/disableEnable',
    method: 'post',
    params
  })
}
// 切割工艺禁启用
export function scCuttingCraftDisableEnable(params) {
  return request({
    url: '/scCuttingCraft/disableEnable',
    method: 'post',
    params
  })
}
// 芯片工艺禁启用
export function scChipCraftDisableEnable(params) {
  return request({
    url: '/scChipCraft/disableEnable',
    method: 'post',
    params
  })
}
// 目检禁启用
export function scVisualInspectionDisableEnable(params) {
  return request({
    url: '/scVisualInspection/disableEnable',
    method: 'post',
    params
  })
}
// 规则所属禁启用
export function scRuleBelongDisableEnable(params) {
  return request({
    url: '/scRuleBelong/disableEnable',
    method: 'post',
    params
  })
}
// 型号查询
export function queryColorModel(params) {
  return request({
    url: '/gyModelColor/list',
    method: 'get',
    params
  })
}

// 型号新增
export function addColorModel(params) {
  return request({
    url: '/gyModelColor/insert',
    method: 'post',
    data: params
  })
}

// 型号修改
export function updateColorModel(params) {
  return request({
    url: '/gyModelColor/update',
    method: 'put',
    data: params
  })
}
// 型号删除
export function deleteColorModel(params) {
  return request({
    url: `/gyModelColor/${params.id}/delete`,
    method: 'delete',
    params
  })
}
