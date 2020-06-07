import axios from 'axios'
import {Loading, Message, MessageBox } from 'element-ui'
import store from '../store'
import router from '@/router/index';
import { getToken } from '@/utils/auth'
var loadinginstace;
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  loadinginstace = Loading.service({ fullscreen: true })
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  loadinginstace.close();
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    loadinginstace.close();
    if(res.code==0||res.code==1){
      return response.data
    }else if(res.code==401){
      sessionStorage.clear();
      Message({
        message:"登录信息已过期",
        type: 'error',
        duration: 3 * 1000
      })
      router.push({path:"/login"})
    }else{
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })

      return Promise.reject('error')
    }
  },
  err => {
    loadinginstace.close();
    Message({
      message: "服务器调皮了",
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(err)
  }
)

export default service
