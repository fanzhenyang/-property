import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import session from '@/utils/auth'
import Layout from '@/layout/index.vue'
import store from '@/store'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    props: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    props: {
      hidden: true
    }
  },
  {
    path: '/',
    component: Layout,
    name: 'Layout',
    children: []
  }
]

export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = session.getItem('ADMIN_TOKEN')
  NProgress.start()
  if (token) {
    if (to.path.includes('/login')) {
      next('/')
    } else {
      const list = store.state.menu.routers
      if (list.length > 0) {
        next()
      } else {
        store.dispatch('menu/getRouter')
          .then(res => {
            next({ ...to, replace: true })
          })
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
})
