import request from '@/utils/request'

// 列表查询
export function findPrint(params) {
  return request({
    url: '/xpBinMather/find',
    method: 'get',
    params
  })
}
// 列表bin查询
export function findBinNo(params) {
  return request({
    url: '/xpBinMather/findBinNo',
    method: 'get',
    params
  })
}
// 机台信息
export function findMachineList() {
  return request({
    url: '/xp-Machine/findList',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100000,
      siteId: 31
    }
  })
}
