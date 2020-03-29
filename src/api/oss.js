import request from '@/utils/request'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })

}
export function deleteFile(data) {
  return request({
    url:'/office/file/delete',
    method:'post',
    data:data
  })

}
