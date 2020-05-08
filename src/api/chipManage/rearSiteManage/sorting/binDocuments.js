import request from '@/utils/request'

// 列表查询
export function findRepeat(params) {
  return request({
    url: '/xpDownBin/findRepeat',
    method: 'get',
    params
  })
}
