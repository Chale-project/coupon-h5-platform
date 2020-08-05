import Vue from 'vue';
import Util from '@/util/utils';
import VueRouter from 'vue-router';
import routerMap from './router';
import { ACCESS_TOKEN } from '../store/storeType';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routerMap
});

router.beforeEach((to, from, next) => {
  Util.title(to.meta.title);
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.name === 'login') {
      next({ name: 'activity' })
    } else {
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        next()
      } else {
        // 跳转到目的路由
        if (to.fullPath === from.query.redirect) {
          next({ replace: true })
        } else {
          next({ path: redirect })
        }
      }
    }
  } else {
    if (!to.meta.auth) {
      // 在免登录路径，直接进入
      next()
    } else {
      next({ name: 'login', query: { redirect: to.fullPath, agentId: to.query.agentId } })
    }
  }
});

router.afterEach((to) => {
  window.scrollTo(0, 0);
});

export default router