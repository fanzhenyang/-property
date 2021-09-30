import http from '@/utils/http'
import { IPlatform, IPlatformTree } from '@/interface/sysm'

// 获取所属平台
interface IPropsPlatform {
  data: IPlatform[]
}
export const list = (params: null, cbs?:() => void):Promise<IPropsPlatform> => {
  return http.request({
    url: 'sysm/platform/list',
    method: 'get',
    cbs,
    params
  })
}

// 获取所属平台获取下面的菜单
interface IPropsTree {
  data: IPlatformTree[]
}
export const listByTree = (params: null, cbs?:() => void):Promise<IPropsTree> => {
  return http.request({
    url: 'sysm/module/listByTree',
    method: 'get',
    cbs,
    params
  })
}
