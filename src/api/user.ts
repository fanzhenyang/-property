import http from '@/utils/http'
import { ILoginData, UserData, Users } from '@/interface/user'

export const login = (data: ILoginData, cbs?:() => void):Promise<UserData<Users>> => {
  return http.request({
    url: 'auth/oauth/token',
    method: 'post',
    cbs,
    data
  })
}
