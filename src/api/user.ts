import http from '@/utils/http'
import { ILoginData, UserData, Users } from '@/interface/user'

export const login = (data: ILoginData, cbs?: () => void): Promise<UserData<Users>> => {
  return http.request({
    url: 'auth/oauth/token',
    method: 'post',
    cbs,
    data
  })
}

// 退出登录
export const logout = (data: null, cbs?: () => void): Promise<void> => {
  return http.request({
    url: 'vue-element-admin/user/logout',
    method: 'post',
    cbs
  })
}

// 重置密码
export const resetPwd = (id: number, cbs?: () => void, type = 'reset', msg = true): Promise<any> => {
  return http.request({
    url: `sysm/user/resetPwd/${id}`,
    method: 'put',
    cbs,
    type,
    msg
  })
}
