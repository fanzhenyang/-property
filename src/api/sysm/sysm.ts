import http from '@/utils/http'
import { IPlatform, IPlatformTree } from '@/interface/sysm'

// 文件上传
export function upload (data: any, cbs?:() => void):Promise<any> {
  return http.request({
    url: 'sysm/files/upload',
    method: 'post',
    data,
    cbs
  })
}

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
export const listByTree = (params: null, cbs?:() => void):Promise<any> => {
  return http.request({
    url: 'sysm/module/listByTree',
    method: 'get',
    cbs,
    params
  })
}

// 新增菜单
interface IFormSub {
  actModelId: string | number
  actModelTypeId: number | string
  auditorFlag?: number
  fileName: string
  logo: string
  memo: string
  moduleName: string
  modulePath: string
  orderNo: number | string
  pId: number | string
  platformId: number | string
  status: number
  url: string
}
export const saveOrUpdate = (data: IFormSub, cbs?:() => void, msg = true):Promise<null> => {
  return http.request({
    url: 'sysm/module/saveOrUpdate',
    method: 'post',
    cbs,
    data,
    msg
  })
}

// 删除菜单
export const deleteById = (id: string, cbs?:() => void, msg = true):Promise<null> => {
  return http.request({
    url: `sysm/module/${id}`,
    method: 'delete',
    cbs,
    msg
  })
}
