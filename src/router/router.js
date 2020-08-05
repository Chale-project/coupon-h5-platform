// 定义所有页面路由
import activity from '@/views/activity/activity';
import step from '@/views/activity/step';
import apply from '@/views/activity/apply';
import orderList from '@/views/order/order';
import orderDetail from '@/views/order/orderDetail';
import register from '@/views/register/register';
import login from '@/views/login/login';
import err404 from '@/views/errorPage/404';

// 导出路由
const routerMap = [

  {
    path: '/activity',
    name: 'activity',
    component: activity,
    meta: {
      title: '积分兑换',
      auth: false
    }
  },
  {
    path: '/activity/step',
    name: 'step',
    component: step,
    meta: {
      title: '兑换流程',
      auth: true
    }
  },
  {
    path: '/activity/apply',
    name: 'apply',
    component: apply,
    meta: {
      title: '兑换申请',
      auth: true
    }
  },
  {
    path: '/order',
    name: 'orderList',
    component: orderList,
    meta: {
      title: '订单',
      auth: true
    }
  },
  {
    path: '/order/orderDetail',
    name: 'orderDetail',
    component: orderDetail,
    meta: {
      title: '订单详情',
      auth: true
    }
  },

  {
    path: '/',
    redirect: '/activity',
    meta: {
      title: '积分兑换',
      auth: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    meta: {
      title: '注册',
      auth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '登录',
      auth: false
    }
  },
  {
    path: '/*',
    name: 'err404',
    component: err404,
    meta: {
      title: '页面不存在-404',
      auth: false
    }
  },
];

export default routerMap