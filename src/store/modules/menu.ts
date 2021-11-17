import { Commit } from 'vuex'
import { Menu } from '@/interface/menu'
import { init } from '@/api/sys/menu'
import roterPermission from '@/utils/routerPermission'

export interface IState {
  routers: Menu[]
}

const state = {
  routers: []
}

const actions = {
  getRouter({ commit }: { commit: Commit }): Promise<any> {
    return new Promise((resolve) => {
      init({ clientIds: 'cdtye-common-sys-client' })
        .then(res => {
          const list = res?.data[0].menus
          const menus = JSON.parse(JSON.stringify(list))
          // menus.splice(2, 0, {
          //   moduleName: '规划管理',
          //   moduleId: 8888
          // })
          resolve(Object.assign([], menus))
          roterPermission(menus)
          commit('SET_ROUTER', menus)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    })
  }
}

const mutations = {
  SET_ROUTER: (state: IState, routerList: Menu[]): void => {
    state.routers = routerList
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
