import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/office/banner/terms',
    method:'post',
    data:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/home/advertise/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeAdvertise(data) {
  return request({
    url:'/office/banner/delete/'+data,
    method:'post',
  })
}
export function getHomeAdvertise(data) {
  return request({
    url:'/office/banner/bannerId/'+data,
    method:'post',
  })
}
export function saveHomeAdvertise(data) {
  return request({
    url:'/office/banner/save',
    method:'post',
    data:data
  })
}



