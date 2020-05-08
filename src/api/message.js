import request from '@/utils/request'

// 查询
export function messageList(params) {
  return request({
    url: '/sysMessage/find',
    method: 'get',
    params
  })
}

// 数量查询
export function findNoReadNum(params) {
  return request({
    url: '/sysMessage/findNoReadNum',
    method: 'get',
    params
  })
}
// 查询公告
export function findNotice(params) {
  return request({
    url: '/sysMessage/findNotice',
    method: 'get',
    params
  })
}
// 附件查询
export function findByDataId(params) {
  return request({
    url: '/attachment/findByDataId',
    method: 'get',
    params
  })
}

// 新增公告
export function addNotice(params) {
  return request({
    url: '/sysMessage/save',
    method: 'post',
    params
  })
}

// 处理
export function messageRead(params) {
  return request({
    url: '/sysMessage/read',
    method: 'post',
    params
  })
}
// 删除
export function remove(params) {
  return request({
    url: `/sysMessage/${params.id}/delete`,
    method: 'delete',
    params
  })
}
