import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/office/wares/queryGoods',
    method:'post',
    data:params
  })
}
export function updateGoodsNorms(params) {
  return request({
    url:'/office/wares/updateNorms',
    method:'post',
    data:params
  })
}
export function saveGoodsNorms(params) {
  return request({
    url:'/office/wares/saveNorms',
    method:'post',
    data:params
  })
}
export function deleteGoodsNorms(params) {
  return request({
    url:'/office/wares/deleteNorms/'+params,
    method:'get',
  })
}
export function classifyList() {
  return request({
    url:'/office/classify/list',
    method:'post'
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}
export function deleteGoodsMsg(params) {
  return request({
    url:'/office/wares/goodsMsg/'+params,
    method:'get',
  })
}

export function updateGoodsStatus(params) {
  return request({
    url:'/office/wares/updateState',
    method:'post',
    data:params
  })
}

export function updateNewsState(params) {
  return request({
    url:'/office/wares/newsState',
    method:'post',
    data:params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url:'/office/wares/recommendState',
    method:'post',
    data:params
  })
}

export function updateNoticeStatus(params) {
  return request({
    url:'/office/wares/noticeState',
    method:'post',
    data:params
  })
}

export function createProduct(data) {
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}





