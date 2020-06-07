import request from '@/utils/request'

export function getNewsList(data) {
  return request({
    url:'office/news/list',
    method:'post',
    data:data
  })
}
export function getNewsById(data) {
  return request({
    url:'office/news/queryById/'+data,
    method:'get',
  })
}

export function saveNews(data) {
  return request({
    url:'office/news/save',
    method:'post',
    data:data
  })
}
export function updateNewsState(state,id) {
  return request({
    url:'office/news/updateNews/'+state+"/"+id,
    method:'get',
  })
}
export function deleteNewsId(id) {
  return request({
    url:'office/news/newsId/'+id,
    method:'get',
  })
}
