'use strict'
import { routes, router } from '@/router/index'
import { Menu } from '@/interface/menu'
import { _RouteLocationBase, RouteRecord } from 'vue-router'

type targetRouter = RouteRecord & _RouteLocationBase
async function routerConfig (routerList: Menu[]): Promise<boolean | void> {
  if (routerList.length === 0) {
    return false
  }

  routes.forEach(route => {
    if (route.name === 'Layout') {
      setAddRoters(routerList, route as targetRouter, true)
    }
  })
}

// 处理动态路由
function setAddRoters (list: Menu[], route: targetRouter, redirect = false) {
  list.forEach((item, index) => {
    if ((item.url && item.modulePath) || (item.children && item.children.length > 0)) {
      if (item.url && item.modulePath) {
        const i = item.modulePath.indexOf('/')
        if (redirect && index === 0) {
          Object.assign(route, { redirect: `${item.url}` })
        }
        route.children.push({
          path: `${item.url}`,
          component: i !== 0 ? () => import(`@/views/${item.modulePath}.vue`) : () => import(`@/views${item.modulePath}.vue`),
          name: item.url?.split('/')[item.url?.split('/').length - 1],
          meta: {

          }
        })
      }
      if (item.children && item.children.length > 0) {
        setAddRoters(item.children, route)
      } else {
        router.addRoute(route)
      }
    }
  })
}

export default routerConfig
