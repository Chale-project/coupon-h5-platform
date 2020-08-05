import Vue from 'vue'
import Vuex from 'vuex'
import api from '../util/api'
import Util from '../util/utils'
import { ACCESS_TOKEN, USER_INFO } from './storeType'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: null,
    token: null,
  },
  mutations: {
    setUserInfo(state, obj) {
      state.userInfo = obj;
    },

    setToken(state, obj) {
      state.token = obj;
    },

  },
  actions: {
    // 注册
    register({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        api.register(paramObj).then(res => {
          if (res.code === 0) {
            const _token = res.result.token.access_token
            const _userInfo = res.result.userInfo
            Vue.ls.set(ACCESS_TOKEN, _token, 7 * 24 * 60 * 60 * 1000)
            // Vue.ls.set(USER_INFO, _userInfo)
            commit('setToken', _token)
            commit('setUserInfo', _userInfo)
            resolve()
          } else {
            Util.notifyError(res.msg)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },

    // 登录
    login({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        api.getAuth(paramObj).then(res => {
          if (res.code === 0) {
            const _token = res.result.token.access_token
            const _userInfo = res.result.userInfo
            Vue.ls.set(ACCESS_TOKEN, _token, 7 * 24 * 60 * 60 * 1000)
            // Vue.ls.set(USER_INFO, _userInfo)
            commit('setToken', _token)
            commit('setUserInfo', _userInfo)
            resolve()
          } else {
            Util.notifyError(res.msg)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },

    // 游客登录
    setVisitorAuth({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        api.visitorAuth(paramObj).then(res => {
          if (res.code === 0) {
            const _token = res.result.token.access_token
            const _userInfo = res.result.userInfo
            Vue.ls.set(ACCESS_TOKEN, _token, 7 * 24 * 60 * 60 * 1000)
            // Vue.ls.set(USER_INFO, _userInfo)
            commit('setToken', _token)
            commit('setUserInfo', _userInfo)
            resolve()
          } else {
            Util.notifyError(res.msg)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },

    // 刷新token
    refreshToken({
      commit
    }) {
      return new Promise((resolve, reject) => {
        api.refreshToken().then(response => {
          if (response.code === 0) {
            const _token = res.result.token.access_token
            Vue.ls.set(ACCESS_TOKEN, _token, 7 * 24 * 60 * 60 * 1000)
            commit('setToken', _token)
            resolve(response)
          } else {
            reject(response)
          }
        })
      })
    },
    // 退出登录
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('setToken', null)
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
      })
    },

  },

  modules: {

  }
});

export default store;
