import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '../views/Layout.vue';
import Login from '../views/Login.vue';
import Config from '../views/Config.vue';
import Dashboard from '../views/Dashboard.vue';
import { getAdminToken } from '../constants';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '首页',
        },
      },
      {
        path: 'config',
        name: 'Config',
        component: Config,
        meta: {
          title: '环境配置管理',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = getAdminToken();
  if (to.path !== '/login' && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    document.title = `${(to.meta.title as string) || 'Admin'} - Card Server`;
    next();
  }
});

export default router;
