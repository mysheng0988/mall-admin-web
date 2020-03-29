import request from '@/utils/request'
export function friendList() {
  return request({
    url:'/office/friend/friendList',
    method:'post'
  })
}

export function pushMsg(data) {
  return request({
    url:'/office/chat/save',
    method:'post',
    data:data
  })
}
