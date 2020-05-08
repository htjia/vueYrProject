import request from '@/utils/request'

// 衬底查询
export function getList(params) {
  return request({
    url: '/wySubstrate/list',
    method: 'get',
    params
  })
}

// 新增衬底信息
export function addSubstrate(params) {
  return request({
    url: '/wySubstrate/insert',
    method: 'post',
    data: params
  })
}
// 数据导入记录
export function dataOperateRecord(params) {
  return request({
    url: '/dataOperateRecord/list',
    method: 'get',
    params
  })
}

// 撤销数据导入记录
export function deleteDataRecord(params) {
  return request({
    url: `/wySubstrate/${params.dataRecordId}/deleteDataRecord`,
    method: 'delete',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/wySubstrate/${params.id}/delete`,
    method: 'delete'
  })
}

// 修改
export function update(params) {
  return request({
    url: '/wySubstrate/update',
    method: 'put',
    data: params
  })
}
