import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/office/kill/terms',
    method:'post',
    data:data
  })
}
export function saveSecKill(data) {
  return request({
    url: '/office/kill/save',
    method: 'post',
    data:data
  })
}

export function getSecKill(param) {
  return request({
    url: '/office/kill/killId/'+param,
    method: 'post',
  })
}
export function deleteSecKill(id) {
  return request({
    url:'/office/kill/delete/'+id,
    method:'post'
  })
}
