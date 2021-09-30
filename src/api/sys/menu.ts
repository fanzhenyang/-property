import http from '@/utils/http'
import { Menu } from '@/interface/menu'
interface OrderItem {
  id: number
  platformCode: string
  platformLogo: string
  platformName: string
  menus: Menu[]
}

interface IProps {
  data: OrderItem[]
}
export const init = <T>(params: T, cbs?:() => void):Promise<IProps> => {
  return http.request({
    url: 'sysm/menu/init',
    method: 'get',
    cbs,
    params
  })
}
