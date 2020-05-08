import request from '@/utils/request'

// 光色列表
export function findColorList() {
  return request({
    url: '/gyColor/findList',
    method: 'get'
  })
}
// 型号管理
export function findModelList() {
  return request({
    url: '/gyModelColor/findModelList',
    method: 'get'
  })
}
// 新增标签
export function findFormEdit(params) {
  return request({
    url: '/xpCustomerLabel/findFormEdit',
    method: 'get',
    params
  })
}
// 显示table title
export function findFormTitle(params) {
  return request({
    url: '/xpCustomerLabel/findFormTitle',
    method: 'get',
    params
  })
}
// 查询接口
export function pageList(params) {
  return request({
    url: '/xpCustomerLabel/pageList',
    method: 'get',
    params
  })
}
// 添加
export function insert(params) {
  return request({
    url: '/xpCustomerLabel/insert',
    method: 'post',
    data: params
  })
}
export function update(params) {
  return request({
    url: '/xpCustomerLabel/update',
    method: 'put',
    data: params
  })
}
export function deleteLabel(params) {
  return request({
    url: `/xpCustomerLabel/${params.id}/delete`,
    method: 'get',
    params
  })
}
export function findYgParamsList(params) {
  return request({
    url: '/xpCustomerLabel/findYgParamsList',
    method: 'get',
    params
  })
}
export function findTaskModelList(params) {
  return request({
    url: '/xpCustomerLabel/findTaskModelList',
    method: 'get',
    params
  })
}
// /xpCustomerLabel/{id}/delete
