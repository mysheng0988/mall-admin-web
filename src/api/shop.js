import request from '@/utils/request'

export function findShop() {
  return request({
    url: '/office/shop/findShop',
    method: 'post',
  })
}
export function shopId(id) {
  return request({
    url: '/office/shop/shopById?id='+id,
    method: 'get',
  })
}
export function shopStatus(id,status) {
  return request({
    url: '/office/shop/updateStatus',
    method: 'post',
    data:{id,status}
  })
}
export function saveShop(data) {
  return request({
    url: '/office/shop/saveShop',
    method: 'post',
    data:data,
  })
}


