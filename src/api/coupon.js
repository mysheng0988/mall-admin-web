import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'office/coupon/couponAll',
    method:'post',
    data:params
  })
}
export function createCoupon(data) {
  return request({
    url:'/office/coupon/createCoupon',
    method:'post',
    data:data
  })
}

export function getCoupon(id) {
  return request({
    url:'/office/coupon/getCoupon?id='+id,
    method:'get',
  })
}

export function updateCoupon(id,data) {
  return request({
    url:'/office/coupon/update',
    method:'post',
    data:data
  })
}

export function deleteCoupon(id) {
  return request({
    url:'/office/coupon/delete?id='+id,
    method:'get',
  })
}
