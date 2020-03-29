import request from '@/utils/request'
export function queryCustomClass(data) {
  return request({
    url:'/office/classify/customClass',
    method:'post',
    data:data
  })
}
export function saveCustomClass(data) {
  return request({
    url:'/office/classify/saveCustomClassify',
    method:'post',
    data:data
  })
}
export function getCustomClassById(id) {
  return request({
    url:'/office/classify/customById/'+id,
    method:'get',
  })
}
export function deleteCustomClass(id) {
  return request({
    url:'/office/classify/deleteCustomClass/'+id,
    method:'get',
  })
}
export function customClassShopId(id) {
  return request({
    url:'/office/classify/customClassShopId/'+id,
    method:'get',
  })
}
