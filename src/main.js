import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls';
import router from './router/index'
import store from './store/store'
import { ACCESS_TOKEN, USER_INFO } from './store/storeType'

Vue.config.productionTip = false

const options = {
  namespace: 'wytd__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
};

Vue.use(Storage, options);

new Vue({
  router,
  store,
  created() {
    store.commit('setToken', Vue.ls.get(ACCESS_TOKEN))
    // store.commit('setUserInfo', Vue.ls.get(USER_INFO))
    if (this.$router.history.current.name !== 'login'&&this.$router.history.current.name !== 'activity') {
      setInterval(() => {//每隔1.5小时刷新token
        store.dispatch('refreshToken').then(data => {
          console.log('token刷新成功')
        }).catch(() => {
          console.log('token刷新失败')
        })
      }, 1.5 * 60 * 60 * 1000)
   }
  },
  render: h => h(App)
}).$mount('#app')
