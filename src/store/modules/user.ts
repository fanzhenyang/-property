import { Commit } from 'vuex'
import { login } from '@/api/user'
import session from '@/utils/auth'
import { ILoginData } from '@/interface/user'
interface IState {
  token: string
  name: string
  avatar: string
  introduction: string
  role: any[]
}

const state = {
  token: session.getItem('ADMIN_TOKEN'),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const actions = {
  login ({ commit }: { commit: Commit }, userInfo: ILoginData):Promise<any> {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (!res) {
          return resolve(false)
        }

        commit('SET_TOKEN', res.access_token)
        session.setItem('ADMIN_TOKEN', res.access_token)
        commit('SET_USER', res.user_name)
        session.setItem('USER_DATA', res.user_name)
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

const mutations = {
  SET_TOKEN: (state: IState, token: string):void => {
    state.token = token
  },
  SET_USER: (state: IState, name: string):void => {
    state.name = name
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
