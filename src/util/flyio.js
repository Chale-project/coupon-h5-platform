import Vue from 'vue'
import Fly from 'flyio';
import store from '../store/store'
import Util from '../util/utils';
import { ACCESS_TOKEN } from '../store/storeType'

Fly.config.timeout = 6000;
Fly.config.baseURL = '/gateway';
//添加请求拦截器
Fly.interceptors.request.use((request) => {
  //给所有请求添加自定义header
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    request.headers['token'] = token // 让每个请求携带自定义 token
  }
  //终止请求
  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return Promise.resolve(request)
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
Fly.interceptors.response.use(
  (response) => {
    if (response.data.code == 401) {
      Util.notifyError('登录超时，请重新登录！')
      store.dispatch('logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1e3)
      })
    } else if (response.data.code === 403) {
      Util.notifyError('无权限，拒绝访问！')
    } else if (response.data.code === 500) {
      Util.notifyError(response.data.msg)
    }
    //只将请求结果的data字段返回
    return Promise.resolve(response.data)
  },
  (err) => {
    //发生网络错误后会走到这里
    Util.showToast('请求出错，请稍后再试！')
    return Promise.reject(err)
  }
)
export default Fly
