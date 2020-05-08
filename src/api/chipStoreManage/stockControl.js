import request from '@/utils/request'
// 柜位查询
export function findArkList(params) {
  return request({
    url: '/xpArk/findList',
    method: 'get',
    params
  })
}
// 柜位新增
export function insert(params) {
  return request({
    url: '/xpArk/insert',
    method: 'post',
    data: params
  })
}

// 根据柜位查询包
export function findWaferByArk(params) {
  return request({
    url: '/xpStorehouse/findWaferByArk',
    method: 'get',
    params
  })
}

// 根据包查询wafer
export function findWaferByBox(params) {
  return request({
    url: '/xpStorehouse/findWaferByBox',
    method: 'get',
    params
  })
}

// 柜位编辑
export function update(params) {
  return request({
    url: '/xpArk/update',
    method: 'put',
    data: params
  })
}
// 柜位调整
export function updateArk(params) {
  return request({
    url: '/xpStorehouse/updateArk',
    method: 'post',
    params
  })
}
// 包号合并
export function updateBoxNo(params) {
  return request({
    url: '/xpStorehouse/updateBoxNo',
    method: 'post',
    params
  })
}
// 柜位删除
export function deleteArk(params) {
  return request({
    url: `xpArk/${params.id}/delete`,
    method: 'delete',
    params
  })
}

