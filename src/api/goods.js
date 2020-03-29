import request from '@/utils/request'
export function saveGoods(data) {
  return request({
    url: '/office/wares/saveGoods',
    method: 'post',
    data: data
  })
}

export function saveNorms(data) {
  return request({
    url: '/office/wares/saveNorms',
    method: 'post',
    data: data
  })
}

export function getGoodsAllMsg(goodsId) {
  return request({
    url:'/office/wares/goodsById/'+goodsId,
    method:'get',
  })
}
export function getGoodsMsg(goodsId) {
  return request({
    url:'/office/wares/msgById/'+goodsId,
    method:'get',
  })
}
export function getGoodsNorms(goodsId) {
  return request({
    url:'/office/wares/normsById/'+goodsId,
    method:'get',
  })
}
export function getGoodsImgByGoodsId(goodsId) {
  return request({
    url:'/office/wares/goodsImg/'+goodsId,
    method:'get',
  })
}
