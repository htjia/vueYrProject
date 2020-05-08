import request from '@/utils/request'

// 列表
export function selects(params) {
  return request({
    url: '/InventoryStatisticsOfAuxiliaryProducts/select',
    method: 'get',
    params
  })
}
