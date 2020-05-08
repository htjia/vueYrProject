import request from '@/utils/request'

// 查询进度
export function querySchedule(params) {
  return request({
    url: '/xp-grind/query-schedule',
    method: 'get',
    params
  })
}
